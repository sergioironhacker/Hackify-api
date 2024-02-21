const Form = require('../models/Form.model');
const { StatusCodes } = require('http-status-codes');

module.exports.getForms = async (req, res, next) => {
  try {
    const forms = await Form.find().populate('user', '-password'); // Esto poblara el campo 'user' con los datos del usuario, excluyendo la contraseña
    res.status(StatusCodes.OK).json(forms);
  } catch (error) {
    next(error);
  }
}