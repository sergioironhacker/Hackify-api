const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const Idea = require('../models/Idea.model');
const Contribution = require('../models/Contribution.model')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


module.exports.createCheckoutSession = async (req, res, next) => {
  const ideaId = req.params.id;
  const contribution = req.body

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
              images: idea.images,
            },
            unit_amount: Math.max(parseInt(contribution.paymentAmount * 100), 50),

          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/ideas/${ideaId}/contributions/${contribution.paymentAmount}`,
      cancel_url: `http://localhost:5173?canceled=true`,
    
    }); 

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
}

module.exports.createContribution = async (req, res, next) => {
  const {ideaId, amount } = req.params;

  try {
    const idea = await Idea.findById(ideaId);

    if(!idea) {
      throw createHttpError(StatusCodes.NOT_FOUND, 'Idea not found');
    }

    const newContribution = await Contribution.create({
      idea: ideaId,
      contributingUser: req.currentUserId,
      paymentAmount: amount  // Fix here: use paymentAmount instead of amount
    });

    idea.contributionTotal += Number(amount);
    await idea.save();

    res.status(StatusCodes.CREATED).json(newContribution);

  } catch (error) {
    next(error);
  }
};
