import React from 'react'

function FunProps({title,desc,img}) {
  return (
    <div className="col-md-4">
            <div className="card mb-4">
                <img style={{height:"200px"}} src={img} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{desc}</p>
                    <button className="btn btn-primary">Go somewhere</button>
                </div>
            </div>
        </div>
  )
}

export default FunProps;