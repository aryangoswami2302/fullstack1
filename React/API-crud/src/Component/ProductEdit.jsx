import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProduct } from "../redux/productSlice";

function ProductEdit() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState(state);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    dispatch(updateProduct(form));
    navigate("/"); // back to home
  };

  return (
    <div className="container mt-4">
      <h2>Edit Product</h2>

      <form onSubmit={handleUpdate}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <button className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default ProductEdit;