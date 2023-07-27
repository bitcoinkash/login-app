
import './App.css'
import React, { useState } from 'react'
import axios from 'axios'
import Login from './login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
  <div>
    <h1>Welcome</h1>
<Router>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      </div>
  )
}

export default App
