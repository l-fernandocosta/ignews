
import { Document } from "@prismicio/client/types/documents"
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps } from "next"
import { useSession } from "next-auth/react"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import Client from "../../../services/prismicHelper"
import styles from '../post.module.scss'

interface PreviewProps {
  posts: {
    slug: string,
    title: string,
    content: string,
    updateAt: string
  }
}


export default function PreviewPost({posts}: PreviewProps) {
  
  const session = useSession();
  const router = useRouter();

    useEffect(() => {

      if(session.data?.activeSession) {
        router.push(`/posts/${posts.slug}`)
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

 
  return (
    <main className={styles.container}>
      <Head><title> {posts.title} | ig.news</title></Head>
      <article className={styles.post}>

        <h1>{posts.title}</h1>
        <time>{posts.updateAt}</time>

        <div
          className={`${styles.postContent} ${styles.previewPost}` }
          dangerouslySetInnerHTML={{ __html: posts.content }}>
        </div>
        <div className={styles.continueReading}>
          Wanna continue reading ?
          <Link href={'/'}>
            <a href="">Subscribe now 🤗</a>
          </Link>
        </div>
        <div>
         
        </div>
      </article>
    </main>


  )
}

export  const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {params: {slug: 'por-que-o-facebook-meta-criou-o-graphql'}}
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  

  const {slug} = params;
  const response: Document = await Client().getByUID('myCustomType', String(slug), {})
  const posts = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.slice(0, 3)),
    updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }),

  }
  return {
    props: { posts, }
  }
}

