import React, { useState } from 'react'
import Image from './Image'

function Funobj() {
    const [data,setdata] = useState({
        name : "Aryan Goswami",
        count : 0,
        isImage : true
    })

    const increment =()=>{
        setdata({...data,count : data.count + 1})
    }

    const decrement =()=>{
        setdata({...data,count : data.count -1})
    }

  return (
    <div>
        <h1>Name : {data.name}</h1>
        <button onClick={() =>setdata({...data,name : "Aman solanki"})}>change name</button>
        <button onClick={() =>setdata({...data,name : "Bhavin panchal"})}>change name</button>

        <h1>Count : {data.count}</h1>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={() =>setdata({...data,count : 0})}>Zero</button>

        <br /><br />
        <button onClick={() =>setdata({...data,isImage : false})}>hide</button>
        <button onClick={() =>setdata({...data,isImage : true})}>show</button>
        <button onClick={() =>setdata({...data,isImage : !data.isImage})}>Toggle</button>

        <br /><br />
        {
            (data.isImage)? <Image /> : false
        }

    </div>
  )
}

export default Funobj