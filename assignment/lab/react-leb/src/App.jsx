import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";

import Counter from "./components/Counter";
import Users from "./components/Users";
import RefExample from "./components/RefExample";
import RecoilTodo from "./components/RecoilTodo";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* LAB Tasks */}
        <Route path="/counter" element={<Counter />} />
        <Route path="/users" element={<Users />} />
        <Route path="/ref" element={<RefExample />} />
        <Route path="/todo" element={<RecoilTodo />} />
      </Routes>
    </>
  );
}

export default App;