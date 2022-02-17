import Stripe from 'stripe'

const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion:'2020-08-27',
    appInfo: {
      name: 'igNews',
      version: '0.1.0'
    }
  }
)
  
export default stripe;