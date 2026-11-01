const mongoose = require("mongoose");
const i18nField = require("./i18nField");
const { Schema } = mongoose;

const CATEGORIES = ["salons", "team-building", "sorties", "conseils"];

const PostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: i18nField(true),
    excerpt: i18nField(),
    content: i18nField(),
    coverImage: { type: String, default: "" },
    category: { type: String, enum: CATEGORIES, default: "conseils" },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

PostSchema.index({ published: 1, publishedAt: -1 });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
module.exports.CATEGORIES = CATEGORIES;
