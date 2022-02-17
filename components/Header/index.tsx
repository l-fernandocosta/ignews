/* eslint-disable @next/next/no-img-element */
import ActiveLink from '../ActiveLink'
import SignInButton from '../SignInButton'
import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/ig.news.svg" alt="" />
        <nav>
          <ActiveLink activeClassName={styles.active} href='/' >
            <a className={styles.active}>Home</a>
          </ActiveLink>

          <ActiveLink activeClassName={styles.active} href='/posts' >
            <a>Posts</a>
          </ActiveLink>

        </nav>
        <SignInButton />
      </div>

    </header>
  )
}