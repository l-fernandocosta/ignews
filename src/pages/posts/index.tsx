import { GetStaticProps } from "next"
import Head from "next/head"

import styles from './styles.module.scss'

import { Client } from "../../services/prismicHelper";

import Prismic from '@prismicio/client'
import ApiSearchResponse from "@prismicio/client/types/ApiSearchResponse";
import { RichText } from "prismic-dom";
import Link from "next/link";

type Post = {
  slug: string;
  title: string, 
  excerpt: string, 
  updatedAt: string, 
}


interface PostsProps {
  posts : Post[]
}


export default function Posts({posts}: PostsProps) {
  console.log(RichText.asText(posts))

  return(
    <>
    
    <Head> <title> Posts | ig.news</title> </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          
          {posts.map((post) => (
           
           <Link href={`/posts/${post.slug}`} key= {post.slug}>
              <a href= '#'>
              <time>{post.updatedAt}</time>
              <strong> {post.title}</strong>
              <p>{post.excerpt}</p>
              </a>
           </Link>
          
          ))}
      
        </div>
      </main>
    </>
  )
}


export const getStaticProps : GetStaticProps = async () => {
  const prismic  =  Client();
  const response : ApiSearchResponse = await prismic.query([Prismic.Predicates.at('document.type', 'myCustomType')],
   {
     fetch: ['myCustomType.title', 'myCustomType.content'],
     pageSize: 100, 
   })

  const posts  = response.results.map(post  => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type ==='paragraph' && content.text != '' )?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: "2-digit",
        month:  "long",
        year: "numeric"
      }
      )
  
    }
    
  })
  
  return {
    
   props: {posts},
   revalidate: 60*60*24 //24hours
   
 }

}
