import mongoose from "mongoose";

const homePageSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: String,
    },
    modifiedBy: {
      type: String,
    },
    title: {
      type: String,
      // required: true,
    },
    subtext: {
      type: String,
    },
    bodyContent: {
      type: String,
    },
    files: {
      type: Object,
      default: {},
    },
    URL: {
      type: String,
      // required: true,
    },
    showAuthor: {
      type: Boolean,
      default: false,
    },
    publishTime: {
      type: String,
      default: `'YYYY-MM-DDTHH:mm:ss'`,
    },
    publishDate: {
      type: String,
      default: `'YYYY-MM-DDTHH:mm:ss'`,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "draft",
    },
  },
  { timestamps: true }
);

const homePageDataSchema = mongoose.model("HomePageData", homePageSchema);
export default homePageDataSchema;
