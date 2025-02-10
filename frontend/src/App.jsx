import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Signup } from './components/Signup';

function App() {

  return (
    <>
    <Router>
    <Routes>
      <Route path="/" element={<Signup></Signup>} ></Route>
      {/* <Route path="/signin" element={<Signin></Signin>} ></Route>
      <Route path="/send" element={<Sendmoney></Sendmoney>} ></Route>
      <Route path="/dashboard" element={<Dashboard></Dashboard>} ></Route> */}
    </Routes>
    </Router>
    </>
  )
}

export default App
