import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import AddStudent from "./Pages/AddStudent/Addstudent";


function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Home />}/>
       <Route path="/add"element={<AddStudent />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;