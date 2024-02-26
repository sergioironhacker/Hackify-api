const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const Form = require('../models/Form.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.createCheckoutSession = async (req, res, next) => {
  const formId = req.params.id;
  console.log('Form ID:', formId);

  try {
    const form = await Form.findById(formId);
    if (!form) {
      throw createHttpError(StatusCodes.NOT_FOUND, 'Form not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: form.title,
              description: form.description,
            },
            unit_amount: Math.max(parseInt(form.price * 100), 50),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/?success=true`,
      cancel_url: `${process.env.GYMHACK_WEB_URL}/store/${formId}?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
}
