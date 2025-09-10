
import styles from "./boards.module.css";
import "../globals.css";

import { redirect } from 'next/navigation'
import Link from 'next/link'

const apiUrl = 'http://localhost:8000'

// prerendering functions with caching
async function getBoardList() {
  const res = await fetch(`${apiUrl}/board`, { method: "GET", cache: "force-cache" });
  const data = await res.json();

  return data.boards;
}
async function getBoard(boardTag) {
  const res = await fetch(`${apiUrl}/board/${boardTag}`, { method: "GET", cache: "force-cache" });
  const data = await res.json();
  
  if(data.error){
    redirect('/errorPage')
  }
  return data.board;
}
async function getThreads(boardTag) {
  const res = await fetch(`${apiUrl}/board/${boardTag}/thread`, { method: "GET", cache: "no-store" });
  const data = await res.json();
  return data.threads;
}

async function getGif() {
  const res = await fetch(`${apiUrl}/getMenuGif`, { method: "GET", cache: "no-store" });
  const data = await res.json();
  return `${apiUrl}/${data}`;
}


export default async function BoardPage({ params }) {
  const { boardTag } = params;

  const [boardList, board, threads, gif] = await Promise.all([
    getBoardList(),
    getBoard(boardTag),
    getThreads(boardTag),
    getGif(),
  ]);



  return (
    <main>
      <header>
        <h2>@Channel</h2>
        <p className={styles.tagInHeader}>[ {boardList.map((board, idx) =>{
            return(
              <Link className={styles.tagInHeader} key={idx} href={board.tag}>{board.tag}/ </Link>
            )
        })} ]</p>
      </header>
      <div className={styles.boardMain}>
        
        <img className={styles.boardGif} src={`${gif}`} alt="Some anime girl gif"/>
        <div className={styles.boardInfo}>
            <h1>/{board.tag}/ - {board.topic}</h1>
        </div>
      </div>
    </main>
  )
}