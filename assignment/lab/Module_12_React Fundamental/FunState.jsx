//  useState :- it's simple varibale 
// state :- chnage a data in same component 
//  syntax :- hook 
// type [define,setdefine] = useState()

import React, { useState } from 'react'
import Image from './Image'

function FunState() {

    const [name,setname] = useState("Aryan Goswami")
    const [count,setcount] = useState(0)
    const [isIamge,setisImage] = useState(true)

  return (
    <div>
        <h1>Name : {name}</h1>
        <button onClick={() =>setname("Aman solanki")}>change name</button>
        <button onClick={() =>setname("Bhavin Panchal")}>change name2</button>

        <h1>Count : {count}</h1>
        <button onClick={() =>setcount(count + 1)}>Increment</button>
        <button onClick={() =>setcount(count - 1)}>Decrement</button>
        <button onClick={() =>setcount(0)}>Zero</button>

        <br /><br />

        <button onClick={() =>setisImage(false)}>hide</button>
        <button onClick={() =>setisImage(true)}>show</button>
        <button onClick={() =>setisImage(!isIamge)}>Toggle</button>
        <br />

        {
            (isIamge)? <Image /> : false
        }
    </div>
  )
}

export default FunState;