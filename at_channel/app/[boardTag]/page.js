'use client'

import styles from "./boards.module.css";
import "../globals.css";

import { useRouter } from 'next/router';
import { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation'

const apiUrl = 'http://localhost:3000'

export default function Page() {

  const params = useParams()
  // console.log(params)

  const {boardTag} = params

  const [board, setBoard] = useState()
  const [threads, setThreads] = useState()


  function getBoard(){
    fetch(`${apiUrl}/board/${boardTag}`,{
      method: "GET"
    })
    .then((res)=>(res.json()))
    .then(
      async(data)=>{
        if(!data.error){
          setBoard(await data.board)
          console.log(data)
        } else{
          console.error(data.error)
          // throw Error("No data")
        }
      }
    )
  }

  function getThreads(){
    fetch(`${apiUrl}/board/${boardTag}/thread`,{
      method: "GET"
    })
    .then((res)=>(res.json()))
    .then(
      async(data)=>{
        if(!data.error){
          setThreads(await data.threads)
          console.log(data)
        } else{
          console.error(data.error)
          // throw Error("No data")
        }
      }
    )
  }

  useEffect(() =>{getBoard()},[])
  useEffect(() =>{getThreads()},[])

  return (
    <main>
      <div className={styles.main}>
        <h1>board - {boardTag}</h1>
      </div>
    </main>
  )
}