import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UserLogni from './pages/UserLogni'
import UserSignup from './pages/UserSignup'
import CaptionLogin from './pages/CaptionLogin'
import CaptionSignin from './pages/CaptionSignin'

const App = () => {
  return (
    <div className="min-h-[100dvh] w-full bg-neutral-950 flex justify-center items-center font-['Outfit',sans-serif]">
      {/* Mobile Phone Screen Viewport Container */}
      <div className="w-full max-w-[480px] h-[100dvh] bg-black relative flex flex-col overflow-hidden sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:rounded-3xl sm:border sm:border-neutral-800">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<UserLogni />} />
          <Route path='/signup' element={<UserSignup />} />
          <Route path='/captain-login' element={<CaptionLogin />} />
          <Route path='/captain-signup' element={<CaptionSignin />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
