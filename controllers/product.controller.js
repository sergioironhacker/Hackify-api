const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const Idea = require('../models/Idea.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.createCheckoutSession = async (req, res, next) => {
  const ideaId = req.params.id;
  console.log('idea ID:', ideaId);

  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      throw createHttpError(StatusCodes.NOT_FOUND, 'Form not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: idea.title,
              description: idea.description,
            },
            unit_amount: Math.max(parseInt(idea.contributionMax * 100), 50),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/?success=true`,
      cancel_url: `http://localhost:5173?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
}
