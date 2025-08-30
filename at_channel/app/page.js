import Image from "next/image";
import Link from 'next/link'
import styles from "./page.module.css";

var fs = require('fs');

export default function Home() {

  let files = fs.readdirSync('./public/mainGifs');
  let rdIdx = Math.floor(Math.random() * files.length)
  let gif = files[rdIdx]
  console.log(gif)

  return (
    <main>
      <header>
        <h2>@Channel</h2>
      </header>
      <div className={styles.main}>
        <img className={styles.mainGif} src={`/mainGifs/${gif}`} alt="Some anime girl gif"/>

        <h1>Wellcome user :3</h1>
        <div className={styles.infoNavigation}>

          <div className={styles.info}>

            <div className={styles.infoNavTitle}>
              <h4>About</h4>
            </div>

            <div className={styles.infoContent}>
              <h3>What is <span>@channel</span>?</h3>
              <h4>It’s image-board where you can share your ideas as anonim and comment others</h4>
              <h4>You can share any info if it’s suitable for the board and doesn’t break laws</h4>
            </div>

            <div className={styles.infoNavTitle}>
              <h4>News of @channel</h4>
            </div>

          </div>

          <div className={styles.navigation}>
            <img className={styles.logoImage} src="logo.png" alt="logo"/>

            <div className={styles.infoNavTitle}>
              <h4>Boards</h4>
            </div>
            <div className={styles.navContent}>
              <Link href="/a">/a/ - anime</Link>
              <Link href="/b">/b/ - random</Link>
              <Link href="/v">/v/ - Video Games</Link>
              <Link href="/e">/e/ - Ecchi</Link>
              <Link href="/pash">/pash/ - pashtet lore</Link>
            </div>

            <div className={styles.infoNavTitle}>
              <h4>Extra info</h4>
            </div>
            <div className={styles.navContent}>
              <Link href="/rules">rules</Link>
              <Link href="/faq">faq</Link>
              <Link href="/admin">admin</Link>
            </div>


          </div>
        </div>
      </div>
      <footer>
        <h2>@channel by freeCum comp.</h2>
      </footer>
    </main>
  );
}
