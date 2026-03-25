import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";

function ProductAdd() {
  const dispatch = useDispatch();
  const redirect = useNavigate()

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      ...form,
      rating: { rate: 0, count: 0 },
    };

    dispatch(addProduct(newProduct)); // 🔥 Redux call

    // reset form
    setForm({
      title: "",
      price: "",
      category: "",
      image: "",
    });
      redirect("/")
  };

  return (
    <div className="container mt-4">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <button className="btn btn-success">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default ProductAdd;