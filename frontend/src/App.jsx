import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Signup } from './components/Signup';
import { Signin } from './components/Signin';
import { Dashboard } from './components/Dashboard';
import { Sendmoney } from './components/Sendmoney';
import { ToastContainer, toast } from 'react-toastify';
import { ProtectedRoute } from './components/ProtectRoute/ProtectedRoute';


function App() {
  const token = localStorage.getItem("token")

  return (
    <>
    <Routes>
      <Route path="/" element={<Signup/>} ></Route>
      <Route path="/signin" element={<Signin/>} ></Route>
      <Route path="/sendmoney/:rId" element={
        <ProtectedRoute>
          <Sendmoney/>
        </ProtectedRoute>
      } ></Route>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} ></Route>
    </Routes>
    <ToastContainer />
    </>
  )
}

export default App
