import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UserLogni from './pages/UserLogni'
import UserSignup from './pages/UserSignup'
import CaptionLogin from './pages/CaptionLogin'
import CaptionSignin from './pages/CaptionSignin'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<UserLogni />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<CaptionLogin />} />
        <Route path='/captain-signup' element={<CaptionSignin />} />
      </Routes>
    </div>
  )
}

export default App
