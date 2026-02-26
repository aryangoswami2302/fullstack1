import React from 'react'
import NavTitle from '../Commen/Navtitle'
import { Link } from 'react-router-dom'

function Notfound() {
    return (
        <div style={{
            // display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center"
        }}>
            <NavTitle title="404 NOT FOUND" name="NOT FOUND" />
            <h1 className='text-success bg-dark'>404 NOT FOUND DATA</h1>
            <Link to="/" className='btn btn-dark '>BACK TO HOME</Link>
        </div>

    )
}

export default Notfound