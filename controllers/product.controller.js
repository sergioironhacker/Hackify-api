const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const Form = require('../models/Form.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


module.exports.getProduct = (req, res, next) => {
    Product.findById(req.params.id)
      .then(product => {
        if (!product) {
          next(createHttpError(StatusCodes.NOT_FOUND, 'Product not found'))
        } else {
          res.status(StatusCodes.OK).json(product)
        }
      })
      .catch(next)
  }
  


module.exports.createCheckoutSession = async (req, res, next) => {
    const respuesta = req.body;

    console.log(respuesta[0].title)

    console.log('entro', process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: respuesta[1].title,
                        description: respuesta[1].description,
                    },
                    unit_amount: Math.max(parseInt(respuesta[1].price * 100), 50), // Ajuste del precio mínimo a 50 centavos
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `http://localhost:5173/?success=true`,
        cancel_url: `${process.env.GYMHACK_WEB_URL}/store/${respuesta[0]._id}?canceled=true`,
    });
console.log('salgo');
    res.json({ url: session.url });
}
