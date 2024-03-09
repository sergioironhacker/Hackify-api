const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ROUNDS = 10;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Required field'],
      trim: true // para borrar espacios blancos innecesarios al principio o final de la palabra
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Required field'],
      match: [EMAIL_REGEX, 'Add a valid email'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "required field"],
      minlength: [8, "invalid length"],
    },
    avatar: {
      type: String,
      default: 'https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png'
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
        delete ret.password;
      },
    },
  }
);

userSchema.virtual('ideas', {
  ref: 'Idea',
  localField: '_id',
  foreignField: 'user',
  justOne: false
}),
userSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'likingUser',
  justOne: false
})

userSchema.virtual('contributions', {
  ref: 'Contribution',
  localField: '_id',
  foreignField: 'contributingUser',
  justOne: false
})

userSchema.virtual('bookmarks', {
  ref: 'Bookmark',
  localField: '_id',
  foreignField: 'bookmarker',
  justOne: false
}
)

// Crear el metodo para comparar contraseñas

userSchema.methods.checkPassword = function (passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
};

// Presave para guardar la contraseña hasheada

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt
      .hash(this.password, ROUNDS)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch(next);
    // .catch(err => next(err))
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User