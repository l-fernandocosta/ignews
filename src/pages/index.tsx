/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps, GetStaticProps } from 'next'
import SubscribeButton from '../components/SubscribeButton'
import stripe from '../services/stripe'
import styles from './home.module.scss'

interface ServerSideProps{
  product: {
    productId: string,
    amount: string
 
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
        for <span id='idAmount'>{product.amount}</span> month
        </p>
        <SubscribeButton/>         
      </section>
      
      <img src="/images/girlcoding.svg" alt="Girl coding" />
    </main>
      
  )
}


export  const getStaticProps: GetStaticProps = async () => {
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
      revalidate: 60*60*24      
     
  }
}
