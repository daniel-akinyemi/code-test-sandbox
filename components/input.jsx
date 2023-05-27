import React from 'react'
import { useEffect } from 'react'

const input = () => {

    useEffect(()=>{
        console.log("Mounted")

    },[])
  return (
    <div>input</div>
  )
}

export default input