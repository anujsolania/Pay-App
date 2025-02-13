import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Signup } from './components/Signup';
import { Signin } from './components/Signin';
import { Dashboard } from './components/Dashboard';
import { Sendmoney } from './components/Sendmoney';
import { ReceiverProvider } from './components/contextAPI/Context';

function App() {

  return (
    <ReceiverProvider>
    <Router>
    <Routes>
      <Route path="/" element={<Signup></Signup>} ></Route>
      <Route path="/signin" element={<Signin></Signin>} ></Route>
      <Route path="/sendmoney" element={<Sendmoney></Sendmoney>} ></Route>
      <Route path="/dashboard" element={<Dashboard></Dashboard>} ></Route>
    </Routes>
    </Router>
    </ReceiverProvider>
  )
}

export default App
