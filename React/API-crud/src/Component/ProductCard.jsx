import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";   // ✅ ADD

function ProductCard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="container py-5">
            <div className="row">
                {data.map((item) => (
                    <div className="col-md-3 mb-4" key={item.id}>
                        <div className="card h-100 shadow">

                            <img
                                src={item.image}
                                className="card-img-top"
                                style={{ height: "200px", objectFit: "contain" }}
                                alt={item.title}
                            />

                            <div className="card-body d-flex flex-column gap-2">
                                <h6>{item.title.substring(0, 40)}...</h6>
                                <p className="text-success">₹ {item.price}</p>

                                <button
                                    className="btn btn-warning mt-auto"
                                    onClick={() => navigate("/view", { state: item })}
                                >
                                    View
                                </button>

                                <button
                                    className="btn btn-info"
                                    onClick={() => navigate("/edit", { state: item })}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductCard;