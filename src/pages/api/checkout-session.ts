import stripe from "../../services/stripe";
import {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import {query as q} from 'faunadb'
import { fauna} from "../../services/faunadb";


type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}



// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //get session user from cookies
  const session = await getSession({req})
    
  //get user from faunadb
 const user = await fauna.query<User>(
   q.Get(
     q.Match(
       q.Index('user_by_email'),
       q.Casefold(session.user.email)
     )
   )
 )

  let customerId = user.data.stripe_customer_id
  if(!customerId) {
    const stripeClient = await stripe.customers.create({
      email: session.user.email
    })
  
    
    await fauna.query(
      q.Update(
        q.Ref(q.Collection('users'), user.ref.id),
        {
          data: {
            stripe_customer_id: stripeClient.id
          }
        }
      )
    )
    customerId = stripeClient.id
  }

  
  

  if(req.method == 'POST') {
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      
      customer: customerId, 
      payment_method_types: ['card'],
      billing_address_collection: "required",
      allow_promotion_codes: true,
      line_items: [
        {price: 'price_1KRBuRDLTaR7mqm9eS7t7Ooy', quantity: 1}
      ],
     
      mode: 'subscription',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })
    return res.status(200).json({sessionId: stripeCheckoutSession.id})
  }else {
    res.setHeader('Allow', 'Post'),
    res.status(405).end('Method not allowed')
  }
}