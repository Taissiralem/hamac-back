const Post = require("../models/Post.js");
const slugify = require("../utils/slugify.js");

const PUBLIC_PAGE_SIZE = 9;

const pickPostFields = (body) => {
  const { title, excerpt, content, coverImage, category, published } = body;
  return { title, excerpt, content, coverImage, category, published };
};

// Slug unique dérivé du titre FR si non fourni
const uniqueSlug = async (wanted, excludeId) => {
  const base = slugify(wanted) || "article";
  let slug = base;
  let i = 2;
  while (await Post.exists({ slug, _id: { $ne: excludeId } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
};

// Liste publique : articles publiés, filtrables par catégorie
exports.getPublishedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || PUBLIC_PAGE_SIZE, 50);
    const filter = { published: true };
    if (req.query.category) filter.category = req.query.category;

    const [posts, totalCount] = await Promise.all([
      Post.find(filter, { content: 0 })
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.getPublishedPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Admin : tous les articles, brouillons compris
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}, { content: 0 }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const fields = pickPostFields(req.body);
    const slug = await uniqueSlug(req.body.slug || fields.title?.fr);
    const post = await Post.create({
      ...fields,
      slug,
      publishedAt: fields.published ? new Date() : undefined,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({ error: "Failed to create post", details: error.message });
  }
};

exports.updatePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Post.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "Post not found" });
    }
    const fields = pickPostFields(req.body);
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined) existing[k] = v;
    });
    if (req.body.slug && req.body.slug !== existing.slug) {
      existing.slug = await uniqueSlug(req.body.slug, id);
    }
    if (existing.published && !existing.publishedAt) {
      existing.publishedAt = new Date();
    }
    const saved = await existing.save();
    res.status(200).json(saved);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(400).json({ error: "Failed to update post", details: error.message });
  }
};

exports.deletePostById = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
