import { fauna } from "../../../services/faunadb";
import { query as q} from 'faunadb'
import stripe from "../../../services/stripe";

export default async function saveSubscriptions(
  subscriptionId: string,
  customerId: string,
  createFunc = false
) {
  // console.log(subscriptionId, customerId)
  //buscar o usuário no banco do Fauna com o {CustomerId} index. 
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const subscriptionData = {
    id: subscription.id,
    status: subscription.status,
    userId: userRef,
    priceId: subscription.items.data[0].price.id,
  }

 if(createFunc) {
  await fauna.query(
    q.Create(
      q.Collection('subscriptions'),
      {data: subscriptionData}
    )
  )
 }else {
  await fauna.query(
   q.Replace(
     q.Select(
       "ref",
       q.Get(
         q.Match(
           q.Index('subscriptions_by_id'),
           subscriptionId
         )
       )
     ), {data: subscriptionData}
   )
  )
 }
}