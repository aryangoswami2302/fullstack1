import React from 'react'
import UsersGet from './Component/UsersGet'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserAdd from './Component/UserAdd'
import Header from './Component/Header'
import EditForm from './Component/EditForm'

function App() {
  return (
    <BrowserRouter>

      <div>
        <Header />
        <Routes>
          <Route path='/' element={<UsersGet />} />
          <Route path='/add' element={<UserAdd />} />
          <Route path='/edit/:id' element={<EditForm />}/>
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App