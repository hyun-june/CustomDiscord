import mongoose from "mongoose";

const seenArticleSchema = new mongoose.Schema(
  {
    watcherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    articleId: {
      type: String,
      required: true,
    },
    subject: String,
    summary: String,
    menuName: String,
    url: String,
    writeDateTimestamp: Date,
    discoveredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);
seenArticleSchema.index(
  {
    watcherId: 1,
    articleId: 1,
  },
  {
    unique: true,
  },
);

const SeenArticleModel =
  mongoose.models.SeenArticle ||
  mongoose.model("SeenArticle", seenArticleSchema);

export const getSeenArticleIds = async (watcherId) => {
  const articles = await SeenArticleModel.find({ watcherId })
    .select("articleId -_id")
    .lean();
  return new Set(articles.map((article) => article.articleId));
};

export const saveSeenArticles = async (watcherId, articles) => {
  if (articles.length === 0) {
    return;
  }

  await SeenArticleModel.bulkWrite(
    articles.map((article) => ({
      updateOne: {
        filter: {
          watcherId,
          articleId: String(article.articleId),
        },
        update: {
          $setOnInsert: {
            watcherId,
            articleId: String(article.articleId),
            subject: article.subject,
            summary: article.summary,
            menuName: article.menuName,
            url: article.url,
            writeDateTimestamp: new Date(article.writeDateTimestamp),
            discoveredAt: new Date(),
          },
        },
        upsert: true,
      },
    })),
  );
};
