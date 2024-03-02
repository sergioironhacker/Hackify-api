const mongoose = require("mongoose");

const contributionSchema = mongoose.Schema(
  {
    paymentAmount: {
      type: Number,
      required: [true, "You must set a specified amount to contribute"],
    },
    idea: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Idea",
      required: [true, "Required field"],
    },
    ideaOwner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Required field"],
    },
    contributingUser: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Required field"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Sirve para cambiar el output de los endpoints cuando hago res.json
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

const Contribution = mongoose.model("Contribution", contributionSchema);
module.exports = Contribution;
