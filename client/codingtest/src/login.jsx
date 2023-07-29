import React from 'react'
import axios from 'axios'
import { useState } from 'react'


const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
  
    const handleLogin = () => {
      console.log(` name: ${usernameOrEmail}`)
      console.log(`password: ${password}`)
      const data = { name: usernameOrEmail.toLowerCase(), password: password };
  
      axios
        .post('http://44.204.19.86:4000/login', data)
        .then((response) => {
          console.log(response.data);
          const username  = response.data.data.username;
          const email  = response.data.data.email;
  
          alert(`Welcome ${username}, Your email is ${email}`);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setErrorMessage("Invalid password");
          } else if (error.response && error.response.status === 404) {
            setErrorMessage("User not found");
          } else {
            setErrorMessage("Server error. Please try again later.");
          }
        });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin();
    };
  
  
  
    return (
      <div className="App">
  
  
     <form className="login" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <div className="error">{errorMessage}</div>}
          <button onClick={handleLogin}>Login</button>
        </form>
     
  
  
      </div>
    )
}

export default Login
