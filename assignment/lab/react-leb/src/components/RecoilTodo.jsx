import { atom, useRecoilState } from "recoil";
import { useState } from "react";

const todoState = atom({
  key: "todoState",
  default: [],
});

function RecoilTodo() {
  const [todos, setTodos] = useRecoilState(todoState);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Add OR Update
  const handleSubmit = () => {
    if (!input) return;

    if (editIndex !== null) {
      // Update
      const updatedTodos = [...todos];
      updatedTodos[editIndex] = input;
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      // Add
      setTodos([...todos, input]);
    }

    setInput("");
  };

  // Delete
  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  // Edit
  const editTodo = (index) => {
    setInput(todos[index]);
    setEditIndex(index);
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow text-center">
        <h3>Todo App </h3>

        <input
          className="form-control my-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter todo..."
        />

        <button className="btn btn-primary mb-3" onClick={handleSubmit}>
          {editIndex !== null ? "Update Todo" : "Add Todo"}
        </button>

        {todos.map((t, i) => (
          <div
            key={i}
            className="d-flex justify-content-between align-items-center bg-light p-2 mb-2 rounded"
          >
            <span>{t}</span>

            <div>
              <button
                className="btn btn-warning btn-sm mx-1"
                onClick={() => editTodo(i)}
              >
                Edit
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteTodo(i)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecoilTodo;