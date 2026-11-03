const crypto = require("crypto");
const StatEvent = require("../models/StatEvent");
const Contact = require("../models/Contact");
const { EVENT_TYPES } = require("../models/StatEvent");

const TZ = "Africa/Algiers";
const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime|curl|wget|python|axios|node-fetch/i;
const SITE_HOSTS = ["hamac-events.com", "www.hamac-events.com", "localhost"];

const clip = (v, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Source de la visite : paramètres utm / gclid / fbclid, sinon le site d'origine
function classifySource({ referrer, utm = {} }) {
  if (utm.source) {
    const raw = clip(utm.source, 60);
    const canon = { facebook: "Facebook", fb: "Facebook", instagram: "Instagram", ig: "Instagram", google: "Google", linkedin: "LinkedIn", tiktok: "TikTok" };
    return { source: canon[raw.toLowerCase()] || raw, medium: clip(utm.medium, 60), campaign: clip(utm.campaign, 80) };
  }
  if (utm.gclid) return { source: "Google Ads", medium: "cpc", campaign: clip(utm.campaign, 80) };
  if (utm.fbclid) return { source: "Facebook", medium: "social", campaign: "" };

  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return { source: "Accès direct", medium: "direct", campaign: "" };
  }
  if (SITE_HOSTS.includes(host)) return null; // navigation interne
  const known = [
    [/(^|\.)google\./, "Google", "organic"],
    [/(^|\.)bing\.com$/, "Bing", "organic"],
    [/(^|\.)(yahoo|duckduckgo|yandex|qwant|ecosia)\./, host, "organic"],
    [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "Facebook", "social"],
    [/(^|\.)instagram\.com$/, "Instagram", "social"],
    [/(^|\.)(linkedin\.com|lnkd\.in)$/, "LinkedIn", "social"],
    [/(^|\.)(t\.co|twitter\.com|x\.com)$/, "X (Twitter)", "social"],
    [/(^|\.)youtube\.com$/, "YouTube", "social"],
    [/(^|\.)(whatsapp\.com|wa\.me)$/, "WhatsApp", "social"],
  ];
  for (const [re, name, medium] of known) if (re.test(host)) return { source: name, medium, campaign: "" };
  return { source: host, medium: "referral", campaign: "" };
}

function deviceOf(ua, width) {
  if (/iPad|Tablet/i.test(ua) || (width >= 600 && width < 1024 && /Android/i.test(ua))) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua) || (width && width < 600)) return "mobile";
  return "desktop";
}

// POST /stats/collect (public) — corps envoyé en text/plain par navigator.sendBeacon
exports.collect = async (req, res) => {
  res.status(204).end(); // on répond tout de suite, l'enregistrement suit
  try {
    const ua = req.headers["user-agent"] || "";
    if (!ua || BOT_UA.test(ua)) return;
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (!EVENT_TYPES.includes(body.type)) return;
    const path = clip(body.path, 200);
    if (!path.startsWith("/") || path.startsWith("/admin")) return;

    const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
    const day = new Date().toLocaleDateString("fr-CA", { timeZone: TZ });
    const salt = process.env.STATS_SALT || process.env.JWT_SECRET_KEY || "hamac";
    const visitor = crypto.createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 20);

    const event = {
      type: body.type,
      path,
      locale: /^\/(fr|en)(\/|$)/.exec(path)?.[1] || "",
      visitor,
      device: deviceOf(ua, Number(body.w) || 0),
      detail: clip(body.detail, 40),
    };
    if (body.type === "pageview" && body.first) {
      const src = classifySource({ referrer: clip(body.referrer, 300), utm: body.utm || {} });
      if (src) Object.assign(event, src, { entry: true });
    }
    await StatEvent.create(event);
  } catch (error) {
    console.error("stats collect:", error.message);
  }
};

const pct = (a, b) => (b ? Math.round(((a - b) / b) * 1000) / 10 : null);

async function totalsBetween(from, to) {
  const [events, visitors, leads] = await Promise.all([
    StatEvent.aggregate([{ $match: { createdAt: { $gte: from, $lt: to } } }, { $group: { _id: "$type", n: { $sum: 1 } } }]),
    StatEvent.aggregate([
      { $match: { createdAt: { $gte: from, $lt: to }, type: "pageview" } },
      { $group: { _id: "$visitor" } },
      { $count: "n" },
    ]),
    Contact.countDocuments({ createdAt: { $gte: from, $lt: to } }),
  ]);
  const by = Object.fromEntries(events.map((e) => [e._id, e.n]));
  const v = visitors[0]?.n || 0;
  return {
    pageviews: by.pageview || 0,
    visitors: v,
    leads,
    calls: by.click_to_call || 0,
    emails: by.click_email || 0,
    vr: by.vr_tour_start || 0,
    conversionRate: v ? Math.round((leads / v) * 1000) / 10 : 0,
  };
}

const topBy = (match, field, limit = 10, extra = {}) =>
  StatEvent.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 }, visitors: { $addToSet: "$visitor" }, ...extra } },
    { $project: { _id: 0, key: "$_id", count: 1, visitors: { $size: "$visitors" } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);

// GET /stats/summary?days=30 (admin)
exports.summary = async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days) || 30, 1), 400);
    const to = new Date();
    const from = new Date(to.getTime() - days * 86400000);
    const prevFrom = new Date(from.getTime() - days * 86400000);
    const range = { createdAt: { $gte: from, $lt: to } };
    const pv = { ...range, type: "pageview" };
    const dayExpr = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TZ } };

    const [totals, previous, daily, dailyLeads, pages, sources, campaigns, devices, locales, leadsByType, leadEvents, entries] =
      await Promise.all([
        totalsBetween(from, to),
        totalsBetween(prevFrom, from),
        StatEvent.aggregate([
          { $match: pv },
          { $group: { _id: dayExpr, pageviews: { $sum: 1 }, visitors: { $addToSet: "$visitor" } } },
          { $project: { _id: 0, day: "$_id", pageviews: 1, visitors: { $size: "$visitors" } } },
        ]),
        Contact.aggregate([
          { $match: range },
          { $group: { _id: dayExpr, leads: { $sum: 1 } } },
          { $project: { _id: 0, day: "$_id", leads: 1 } },
        ]),
        topBy(pv, "path", 15),
        topBy({ ...pv, entry: true }, "source", 12),
        topBy({ ...pv, entry: true, campaign: { $ne: "" } }, "campaign", 10),
        topBy(pv, "device", 3),
        topBy({ ...pv, locale: { $ne: "" } }, "locale", 2),
        Contact.aggregate([{ $match: range }, { $group: { _id: "$type", count: { $sum: 1 } } }, { $project: { _id: 0, key: "$_id", count: 1 } }, { $sort: { count: -1 } }]),
        StatEvent.find({ ...range, type: "lead" }, { visitor: 1, createdAt: 1 }).lean(),
        StatEvent.find({ ...pv, entry: true }, { visitor: 1, source: 1 }).lean(),
      ]);

    // Série quotidienne complète (jours sans visite à 0)
    const byDay = new Map();
    for (let t = from.getTime(); t <= to.getTime(); t += 86400000) {
      const day = new Date(t).toLocaleDateString("fr-CA", { timeZone: TZ });
      byDay.set(day, { day, pageviews: 0, visitors: 0, leads: 0 });
    }
    for (const d of daily) if (byDay.has(d.day)) Object.assign(byDay.get(d.day), d);
    for (const d of dailyLeads) if (byDay.has(d.day)) byDay.get(d.day).leads = d.leads;

    // Demandes par source : la source d'arrivée du même visiteur (même jour)
    const sourceOf = new Map(entries.map((e) => [e.visitor, e.source]));
    const leadSources = {};
    for (const l of leadEvents) {
      const s = sourceOf.get(l.visitor) || "Inconnue";
      leadSources[s] = (leadSources[s] || 0) + 1;
    }

    res.json({
      days,
      from,
      to,
      totals,
      changes: Object.fromEntries(Object.keys(totals).map((k) => [k, pct(totals[k], previous[k])])),
      daily: [...byDay.values()],
      pages,
      sources,
      campaigns,
      devices,
      locales,
      leadsByType,
      leadsBySource: Object.entries(leadSources)
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count),
    });
  } catch (error) {
    console.error("stats summary:", error);
    res.status(500).json({ error: "Failed to compute stats" });
  }
};
