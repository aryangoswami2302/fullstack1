import React, { useState } from 'react'

function FunArray() {
    
    const [array,setarray] = useState([
        "Aryan",
        21,
        "aryan25@gmail.com",
        "Goswami",
    ])

  return (
    <div>
        <h1 className='text-decoration-underline m-4'>Person'S Details</h1>
        <h2 className='text-capitalize m-4'>Name : {array[0]}</h2>
        <button onClick={() =>setarray([0] )}>change name</button>
        <h2 className='text-capitalize m-4'>age : {array[1]}</h2>
        <h2 className='text-capitalize m-4'>email : {array[2]}</h2>
        <h2 className='text-capitalize m-4'>address : {array[3]}</h2>

    </div>
  )
}

export default FunArray