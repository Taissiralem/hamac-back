// Données de démonstration (réalisations, articles, sorties) pour le développement local.
// N'écrase rien : ne s'exécute que si les collections sont vides.
// Usage : npm run seed:demo   (refuse de tourner si NODE_ENV=production)
require("dotenv").config();
const connectDB = require("../config/db");
const Realisation = require("../models/Realisation");
const Post = require("../models/Post");
const AddSortie = require("../models/addSortie");

const u = (id) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const realisations = [
  { title: { fr: "Stand modulaire, salon de l'industrie", en: "Modular stand, industry fair" }, client: "Client industriel", location: "Alger", date: "2026", category: "salons", images: [u("1761195689615-9469b65dac01")], featured: true, order: 1 },
  { title: { fr: "Espace d'accueil et comptoir sur mesure", en: "Custom reception area and counter" }, client: "Marque cosmétique", location: "Oran", date: "2026", category: "salons", images: [u("1761225646548-bc92fea0dc72")], featured: true, order: 2 },
  { title: { fr: "Présentation produit sur salon", en: "Product presentation at a show" }, location: "Alger", date: "2025", category: "salons", images: [u("1762028892701-692dc360db08")], featured: true, order: 3 },
  { title: { fr: "Hall d'exposition, coordination générale", en: "Exhibition hall, overall coordination" }, location: "Alger", date: "2025", category: "salons", images: [u("1785123463585-1ba21ff9ff57")], order: 4 },
  { title: { fr: "Mobilier et aménagement d'espace", en: "Furniture and space design" }, location: "Constantine", date: "2025", category: "salons", images: [u("1777499576432-28cb3ff31e70")], order: 5 },
  { title: { fr: "Conférence plénière", en: "Plenary conference" }, location: "Alger", date: "2025", category: "salons", images: [u("1511578314322-379afb476865")], featured: true, order: 6 },
  { title: { fr: "Journée cohésion en plein air", en: "Outdoor team day" }, location: "Tipaza", date: "2026", category: "team-building", images: [u("1774599661166-ae302f07dd37")], featured: true, order: 1 },
  { title: { fr: "Régate inter-services", en: "Inter-department regatta" }, location: "Sidi Fredj", date: "2025", category: "team-building", images: [u("1491911923017-19f90d8d7f83")], order: 2 },
];

const posts = [
  {
    title: { fr: "Préparer son premier salon professionnel : le rétroplanning", en: "Preparing your first trade show: the schedule" },
    excerpt: { fr: "De J-120 au démontage, les étapes à ne pas manquer pour arriver serein le jour de l'ouverture.", en: "From four months out to dismantling, the steps not to miss to arrive calm on opening day." },
    content: {
      fr: "## Quatre mois avant\n\nRéservez votre surface et fixez vos objectifs : combien de contacts, quels produits mettre en avant, quel budget.\n\n## Deux mois avant\n\nValidez le rendu 3D du stand et lancez la fabrication. Commandez vos supports de communication.\n\n## Le mois du salon\n\n- Briefez les hôtesses et l'équipe commerciale\n- Confirmez les horaires de montage avec l'organisateur\n- Préparez un outil simple pour qualifier les visiteurs\n\n> Un salon réussi se joue avant l'ouverture des portes.",
      en: "## Four months before\n\nBook your space and set your goals: how many leads, which products to feature, what budget.\n\n## Two months before\n\nApprove the stand's 3D render and start the build. Order your printed materials.\n\n## The month of the show\n\n- Brief the hosts and the sales team\n- Confirm setup times with the organiser\n- Prepare a simple tool to qualify visitors",
    },
    coverImage: u("1785123463585-1ba21ff9ff57"),
    category: "salons",
  },
  {
    title: { fr: "Stand sur mesure ou modulaire : comment choisir ?", en: "Custom or modular stand: how to choose?" },
    excerpt: { fr: "Budget, fréquence des salons, image de marque : nos critères pour trancher.", en: "Budget, show frequency, brand image: our criteria to decide." },
    content: { fr: "## Le stand modulaire\n\nIdéal si vous participez à plusieurs salons par an : les éléments se réutilisent et se reconfigurent.\n\n## Le stand sur mesure\n\nPour un lancement ou un salon stratégique, il offre une liberté totale de forme et de matériaux.", en: "## Modular stands\n\nIdeal if you attend several shows a year: elements are reused and reconfigured.\n\n## Custom stands\n\nFor a launch or a strategic show, they offer total freedom of shape and materials." },
    coverImage: u("1761225646548-bc92fea0dc72"),
    category: "salons",
  },
  {
    title: { fr: "Cinq signes qu'il est temps d'organiser un team building", en: "Five signs it's time for a team building" },
    excerpt: { fr: "Nouvelles recrues, fusion de services, période intense : les bons moments pour réunir vos équipes.", en: "New hires, merged departments, busy periods: the right moments to bring your teams together." },
    content: { fr: "Un team building est plus utile quand il répond à un besoin précis. Voici les situations où nous le recommandons le plus souvent.", en: "Team building is most useful when it meets a specific need. Here are the situations where we recommend it most often." },
    coverImage: u("1774599661166-ae302f07dd37"),
    category: "team-building",
  },
];

const sorties = [
  { titleFr: "Tipaza, ruines romaines et littoral", titleEn: "Tipaza, Roman ruins and coastline", descFr: "Visite guidée du site archéologique classé, atelier découverte de l'histoire antique et pique-nique au bord de la mer.", descEn: "Guided tour of the listed archaeological site, ancient history workshop and seaside picnic.", days: "1", localisation: "Tipaza", images: [u("1759313196329-8a943fb5695d")] },
  { titleFr: "Parc national et sciences de la nature", titleEn: "National park and natural sciences", descFr: "Randonnée encadrée, observation de la faune et de la flore, atelier avec un guide naturaliste.", descEn: "Supervised hike, wildlife and plant observation, workshop with a naturalist guide.", days: "1", localisation: "Chréa", images: [u("1594608661623-aa0bd3a69d98")] },
  { titleFr: "Jeux coopératifs et plein air", titleEn: "Cooperative outdoor games", descFr: "Une journée d'activités en équipe pour travailler l'entraide et la communication.", descEn: "A day of team activities to build mutual help and communication.", days: "1", localisation: "Alger", images: [u("1517164850305-99a3e65bb47e")] },
];

(async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("seed-demo refuse de tourner en production.");
    process.exit(1);
  }
  const con = await connectDB();
  if (!(await Realisation.countDocuments())) await Realisation.insertMany(realisations);
  if (!(await Post.countDocuments())) {
    const now = Date.now();
    await Post.insertMany(
      posts.map((p, i) => ({
        ...p,
        slug: require("../utils/slugify")(p.title.fr),
        published: true,
        publishedAt: new Date(now - i * 9 * 864e5),
      }))
    );
  }
  if (!(await AddSortie.countDocuments())) await AddSortie.insertMany(sorties);
  console.log("Données de démonstration prêtes.");
  await con.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
