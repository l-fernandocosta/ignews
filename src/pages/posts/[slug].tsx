
import { Document } from "@prismicio/client/types/documents"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { RichText } from "prismic-dom"
import Client from "../../services/prismicHelper"
import styles from './post.module.scss'

interface PostsProps {
    post: {
      slug: string,
      title: string,
      content: string,
      updateAt: string
    }
}




export default function Slug({ post }: PostsProps) {
  return (
    <main className={styles.container}>
      <Head><title> {post?.title} | ig.news</title></Head>
      <article className={styles.post}>

        <h1>{post.title}</h1>
        <time>{post.updateAt}</time>

        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content }}>

        </div>
      </article>
    </main>


  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  if (!session) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false
      }
    }
  }
  const response: Document = await Client().getByUID('myCustomType', String(slug), {})
  const post = {
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
    props: { post }
  }
}