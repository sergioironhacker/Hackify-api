const mongoose = require('mongoose');

const ideaSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Idea title is required.'],
    },
    description: {
      type: String,
      required: [true, 'Idea description is required.'],
    },
    contributionMax: {
      type: Number,
      required: [true, 'Maximum contribution amount is required.']
    },
    images: [{ type: String }],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    contributionTotal: {  //////////////////////////////////
      type: mongoose.Schema.Types.ObjectId, ////////////////////////////
      ref: 'Contribution', // Referencia al modelo de contribución que va a ser un array de strings 
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

const Idea = mongoose.model('Idea', ideaSchema);

module.exports = Idea;