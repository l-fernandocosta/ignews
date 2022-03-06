import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

//db
import {fauna}  from "../../../services/faunadb"
import { query as q } from "faunadb"
import { getSession } from "next-auth/react"

const session = getSession();
export default NextAuth({
  
  providers: [
    
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  ],
  jwt: {
    secret: process.env.SIGNIN_KEY
  },
  callbacks: {
    
    async session({session}) {
      try{
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
              ])
          )
        )
  
  
        return {...session, activeSession: userActiveSubscription};
      }catch{
        return session
      }
    },
    
  
    async signIn({ user, account, profile, email, credentials }) {
    await fauna.query(
      q.If(
        q.Not(
          q.Exists(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(user.email)
            )
          )
        ),
        q.Create(
          q.Collection('users'),
          {data: user}
        ),
        q.Get(
          q.Match(
            q.Index('user_by_email'),
            q.Casefold(user.email)
          )
        )
      )
      
    )
      return true;
      
    }
  }
})