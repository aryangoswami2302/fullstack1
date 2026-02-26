import React from 'react'
import Aheader from '../Acomman/Aheader'
import ANavTitle from '../Acomman/ANavTitle'

function Dashbord() {
    return (
        <div>
            <Aheader />
            <ANavTitle title="Dashbord" name="Dashbord" />
            <h1 className='text-center text-success bg-dark'>Hello This Dashboard Pages</h1>
        </div>
    )
}

export default Dashbord