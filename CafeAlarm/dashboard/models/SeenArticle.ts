import mongoose, { Schema } from "mongoose";

const seenArticleSchema = new Schema({
  watcherId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  articleId: {
    type: String,
    required: true,
  },
});

export const SeenArticleModel =
  mongoose.models.SeenArticle ||
  mongoose.model("SeenArticle", seenArticleSchema);
