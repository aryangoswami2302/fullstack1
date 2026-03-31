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
import RoomAdd from './Admin/Apages/RoomAdd'
import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TeamManage from './Admin/Apages/TeamManage'
import TeamAdd from './Admin/Apages/TeamAdd'

function App() {
  return (
    <BrowserRouter>
      <div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/room' element={<Room />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='team' element={<Team />} />
          <Route path='/Testimonial' element={<Testimonial />} />
          <Route path='/contect' element={<Contect />} />
          <Route path='*' element={<Notfound />} />

          {/* Admin path */}

          <Route path='/Dashbord' element={<Dashbord />} />
          <Route path='/roomManage' element={<RoomManage />} />
          <Route path='/roomadd' element={<RoomAdd />} />
          <Route path='/teamManage' element={<TeamManage />}/>
          <Route path='/teamadd' element={<TeamAdd />}/>
          <Route path=''/>

        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App