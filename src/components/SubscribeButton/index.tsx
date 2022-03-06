import styles from './styles.module.scss'
import {signIn, useSession } from 'next-auth/react'
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import { useRouter } from 'next/router';


export default function SubscribeButton() {
  const {data: session} = useSession();
  const router = useRouter();
  async function handleSubscribe() {
    
    if(!session) {
      signIn('github')
      
      return;
    } 

    if(session) {
      router.push('/posts')
     
      return;
    }
      // criação checkout session
      try {
        const response = await api.post('/checkout-session')
        const {sessionId} = response.data;
        const stripe = await getStripeJs()  
        await stripe.redirectToCheckout({sessionId: sessionId})
        
        
      }catch{
        console.log('Error')
      }
  }
    return (
          <button
            type="button"
            className={styles.subscribeBtn}
            onClick={handleSubscribe}
            
           >Subscribe now</button>
        
      )  
}