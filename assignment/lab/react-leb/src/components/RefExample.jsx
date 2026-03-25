import { useRef } from "react";

function RefExample() {
  const inputRef = useRef();

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <div className="container mt-4 text-center">
      <div className="card p-4 shadow">
        <h3 className="mb-3">useRef Example</h3>

        <input
          ref={inputRef}
          className="form-control mb-3"
          placeholder="Enter something..."
        />

        <button className="btn btn-primary" onClick={handleFocus}>
          Focus Input
        </button>
      </div>
    </div>
  );
}

export default RefExample;