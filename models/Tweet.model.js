const mongoose = require('mongoose');

// CAMBIAR A NOMBRE FINAL

const tweetSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Required field'],
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Required field'],
    }
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
)

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;