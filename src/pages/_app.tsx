import {AppProps} from 'next/app'
import Head from 'next/head'
import Header from '../components/Header'
import '../styles/global.scss'
import {SessionProvider as NextAuthProvider} from 'next-auth/react';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MyApp({ Component,  pageProps:{session, ...pageProps}}: AppProps){
  return (
  
  <NextAuthProvider session={session}>
    <Head><title>ig.news</title></Head>
    <Header/>
    <ToastContainer autoClose= {2500}
    position = 'bottom-center'
    hideProgressBar
    theme= 'colored'  
    
    
    
    />
    <Component {...pageProps} />
  </NextAuthProvider>
    )
}

export default MyApp
