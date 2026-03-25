import React from 'react'
import ProductCard from './Component/ProductCard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Component/Header'
import ProductAdd from './Component/ProductAdd'
import ProductEdit from './Component/ProductEdit'
import ProductView from './Component/ProductView'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path='/' element={<ProductCard />} />
          <Route path='/add' element={<ProductAdd />} />
          <Route path='/edit'element={<ProductEdit />}/>
          <Route path='/view' element={<ProductView />}/>
        </Routes>
      </div>
    </BrowserRouter>

  )
}

export default App