import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './page/Signup'
import Signin from './page/Signin'
import { Authcontext } from './context/Authcontext'
import Navbar from './component/Navbar'
import { ToastContainer } from 'react-toastify'
import Modal from './component/Modal'
import Home from './page/Home'
import Profile from './page/Profile'
import Createpost from './page/Createpost'
import Userprofile from './page/Userprofile'
import Followingpost from './page/Followingpost'
import Createreel from './page/Createreel'
import ReelsFeed from './page/Reelsfeed'

function App() {
  // const [count, setCount] = useState(0)
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <BrowserRouter>
        <div className='App'>
        <Authcontext.Provider value={{ setUserLogin, setModalOpen }}>
        <Navbar login={userLogin}/>
          <Routes>
          <Route path='/' element={<Home/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/signin' element={<Signin/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/postadd' element={<Createpost/>}></Route>
            <Route path="/profile/:userid" element={<Userprofile />} ></Route>
            <Route path='/followingposts' element={<Followingpost/>}></Route>
            <Route path='/Createreel' element={<Createreel/>}></Route>
            <Route path='/ReelsFeed' element={<ReelsFeed/>}></Route>
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
          <ToastContainer/>
          {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
          </Authcontext.Provider>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
