import styles from './styles.module.scss'
import {GoMarkGithub} from 'react-icons/go'
import {FiX} from 'react-icons/fi'

import { useSession, signIn, signOut } from "next-auth/react"
import { toast } from 'react-toastify';

export default function SignInButton() {
  const {data: session, status} = useSession();
  
  return (session) ? (
    <button type="button" className={styles.signInButton} onClick = {() =>  signOut().then(() => {
      toast.success('Até a próxima !')
    })}><GoMarkGithub color='#04d361' size={25}/> 
    {session.user?.name}<FiX className={styles.closeBtn}/></button>
      
      
  )  :  (
  <button type="button" className={styles.signInButton} onClick={() =>  signIn('github').then(async ()=> {
    
    toast.success(`Vamos ler as notícias ?`)
  })}>
    <GoMarkGithub color='#eba417' size={25}
  /> Sign in with GitHub</button>
  

        

  );
   
} 