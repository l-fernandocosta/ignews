
import { NextApiRequest, NextApiResponse } from "next";
import {buffer} from 'micro'
import stripe from "../../services/stripe";
import Stripe from "stripe";
import saveSubscriptions from "./_lib/manageSubscription";

//disable nextjs bodyParser
export const config = {
  api: {
    bodyParser: false 
  }
}

const endPointSecret =  process.env.STRIPE_WEBHOOK_SECRET;

const relevantsEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted'
])

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async(req: NextApiRequest, res: NextApiResponse)  => {
  if(req.method=== 'POST'){
    
    const buf = await buffer(req)
    const signature = req.headers['stripe-signature']
    
    let event: Stripe.Event;
    try{
      event = stripe.webhooks.constructEvent(
        buf, signature, endPointSecret)
    }catch(err){
      return res.status(400).send({err: `err.message`})
    }

    const { type } = event;

    if (relevantsEvents.has(type)){
        
        try{
          switch(type){ 

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
              const subscription = event.data.object as Stripe.Subscription;
              console.log(subscription);
              saveSubscriptions(
                subscription.id,
                subscription.customer.toString(),
                false
              )
              break;


            case 'checkout.session.completed':

              const checkoutSession = event.data.object as Stripe.Checkout.Session
              
                saveSubscriptions(
                  checkoutSession.subscription.toString(),
                  checkoutSession.customer.toString(),
                  true
              )
                  break;
           
            default: throw new Error;
          }      
        }catch(err){
          return res.json({error:'Webhook failed. '})
        }
    }
    
    res.json({received: true})

  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }


}