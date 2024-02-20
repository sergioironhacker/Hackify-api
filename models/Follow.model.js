const mongoose = require('mongoose');

const followSchema = mongoose.Schema(
  {
    follower: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Required field'],
    },
    followed: {
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
    }
  },
);

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;