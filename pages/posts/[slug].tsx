
import { Document } from "@prismicio/client/types/documents"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { RichText } from "prismic-dom"
import Client from "../../services/prismicHelper"
import styles from './post.module.scss'

interface PostsProps {
  posts: {
    slug: string,
    title: string,
    content: string,
    updateAt: string
  }
}



export default function Slug({ posts }: PostsProps) {
  return (
    <main className={styles.container}>
      <Head><title> {posts.title} | ig.news</title></Head>
      <article className={styles.post}>

        <h1>{posts.title}</h1>
        <time>{posts.updateAt}</time>

        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: posts.content }}>

        </div>
      </article>
    </main>


  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  
  const {slug} = params;

  if (!session?.activeSession) {
    return {
      redirect: {
        destination: `/posts/Preview/${slug}`,
        permanent: false
      }
    }
  }
  const response: Document = await Client().getByUID('myCustomType', String(slug), {})
  const posts = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }),

  }
  return {
    props: { posts }
  }
}