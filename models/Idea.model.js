const mongoose = require("mongoose");
const CATEGORIES = require("../misc/categories");

const ideaSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Idea title is required."],
    },
    description: {
      type: String,
      required: [true, "Idea description is required."],
    },
    fullDescription: {
      type: String,
      required: [true, "Idea details text is required."],
    },
    contributionMax: {
      type: Number,
      required: [true, "Maximum contribution amount is required."],
    },
    contributionLimitActive: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: [String],
      enum: CATEGORIES,
      required: [true, "A category is required."],
    },
    timeLimit: {
      type: Date,
      required: [true, "Time limit is required."],
    },
    location: {
      city: {
        type: String,
        required: [true, "City is required."],
      },
      country: {
        type: String,
        required: [true, "Country is required."],
      },
      zipcode: {
        type: String,
        required: [true, "Zipcode is required."],
      },
    },
    images: [{ type: String }],
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true
    },

    contributionTotal: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    backersCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
      },
    },
  }
);


ideaSchema.virtual("contributions", {
  ref: "Contribution",
  localField: "_id",
  foreignField: "idea",
  justOne: false,
});
ideaSchema.virtual("bookmarks", {
  ref: "Bookmark",
  localField: "_id",
  foreignField: "idea",
  justOne: false,
});

// Validation to check contribution limit
ideaSchema.pre("save", function (next) {
  if (
    this.contributionLimitActive &&
    this.contributionTotal > this.contributionMax
  ) {
    const error = new Error("Contribution limit exceeded.");
    return next(error);
  }
  next();
});

const Idea = mongoose.model("Idea", ideaSchema);

module.exports = Idea;
