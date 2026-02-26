import React from 'react'
import Home from './Website/Pages/Home'
import About from './Website/Pages/About'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Services from './Website/Pages/Services'
import Room from './Website/Pages/Room'
import Booking from './Website/Pages/Booking'
import Team from './Website/Pages/Team'
import Testimonial from './Website/Pages/Testimonial'
import Contect from './Website/Pages/Contect'
import Notfound from './Website/Pages/Notfound'
import Dashbord from './Admin/Apages/Dashbord'
import RoomManage from './Admin/Apages/RoomManage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />}></Route>
        <Route path='/room' element={<Room />}/>
        <Route path='/booking'element={<Booking />}></Route>
        <Route path='team' element={<Team />}></Route>
        <Route path='/Testimonial' element={<Testimonial />}></Route>
        <Route path='/contect' element={<Contect />}></Route>
        <Route path='*' element={<Notfound />}></Route>


      {/* Admin path */}

      <Route path='/Dashbord' element={<Dashbord />}/>
      <Route path='/roomManage' element={<RoomManage/>}/>


      </Routes>
    </BrowserRouter>
  )
}

export default App