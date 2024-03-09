const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema(
  {
    bookmarker: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Required field'],
    },
    bookmarkedIdea: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Idea',
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
    }
  },
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;