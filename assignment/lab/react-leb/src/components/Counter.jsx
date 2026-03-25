import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../redux/counterSlice";
import { useState } from "react";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4 text-center" style={{ width: "350px" }}>
        
        <h3 className="mb-3"> Smart Counter</h3>

        <h1
          className={`mb-4 ${
            count > 0 ? "text-success" : count < 0 ? "text-danger" : "text-secondary"
          }`}
        >
          {count}
        </h1>

        {/* Step Input */}
        <input
          type="number"
          className="form-control mb-3"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          placeholder="Enter step value"
        />

        {/* Buttons */}
        <div className="d-flex justify-content-between">

          <button
            className="btn btn-success px-3"
            onClick={() => {
              for (let i = 0; i < step; i++) dispatch(increment());
            }}
          >
            + Add
          </button>

          <button
            className="btn btn-danger px-3"
            onClick={() => {
              for (let i = 0; i < step; i++) dispatch(decrement());
            }}
          >
            - Sub
          </button>

          <button
            className="btn btn-warning px-3"
            onClick={() => window.location.reload()}
          >
            Reset
          </button>

        </div>
      </div>
    </div>
  );
}

export default Counter;