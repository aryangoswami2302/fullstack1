import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductView() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>No Product Found</h2>;
  }

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>
        ⬅ Back
      </button>

      <div className="card p-4 shadow">
        <div className="row">
          
          <div className="col-md-5 text-center">
            <img
              src={state.image}
              alt={state.title}
              style={{ height: "300px", objectFit: "contain" }}
            />
          </div>

          <div className="col-md-7">
            <h3>{state.title}</h3>
            <h4 className="text-success">₹ {state.price}</h4>

            <p><b>Category:</b> {state.category}</p>

            <p>{state.description}</p>

            <p>
              ⭐ {state.rating.rate} ({state.rating.count})
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductView;