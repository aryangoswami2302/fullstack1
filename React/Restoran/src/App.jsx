import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Website/Pages/Home'
import About from './Website/Pages/About'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/home' element={<Home />}></Route>
       <Route path='/about' element={<About />}></Route>
    </Routes>
    </BrowserRouter>
     

  )
}

export default App