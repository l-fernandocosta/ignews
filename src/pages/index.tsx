/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from 'next'
import SubscribeButton from '../components/SubscribeButton'
import stripe from '../services/stripe'
import styles from './home.module.scss'

interface ServerSideProps{
  product: {
    productId: string,
    amount: number
 
  }
}

export default function Home({product} : ServerSideProps) {
  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span> Hey, welcome 😍 </span>
        <h1>News about the <span> React</span> world.</h1>
        <p>
        Get acess to <span>all</span> the publications <br />
        for <span>{product.amount}</span> month
        </p>
        <SubscribeButton priceId={product.productId}/>         
      </section>
      
      <img src="/images/Mulher.svg" alt="Girl coding" />
    </main>
      
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1KRBuRDLTaR7mqm9eS7t7Ooy')
  const product = {
    priceId: price.id,
    amount:new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount/100)
  }
  return{
      props:{
        product
      },
      
     
  }
}
