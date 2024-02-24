const Form = require('../models/Form.model');
const { StatusCodes } = require('http-status-codes');

module.exports.createForm = (req, res, next) => {
  const { title, description, price } = req.body;
  const userId = req.currentUserId;

  Form.create({ title, description, price, user: userId })
    .then(createdForm => {
      res.status(StatusCodes.CREATED).json(createdForm);
    })
    .catch(next);
};

module.exports.getForms = async (req, res, next) => {
  try {
    const forms = await Form.find().populate('user', '-password'); // Esto poblara el campo 'user' con los datos del usuario, excluyendo el password
    res.status(StatusCodes.OK).json(forms);
  } catch (error) {
    next(error);
  }
};