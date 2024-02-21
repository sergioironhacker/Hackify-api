const mongoose = require('mongoose');

const formSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título del formulario es obligatorio'],
    },
    description: {
      type: String,
      required: [true, 'La descripción del formulario es obligatoria'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo de usuario
      required: [true, 'El usuario es obligatorio'],
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Cambia el output de los endpoints cuando se llama a res.json
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
