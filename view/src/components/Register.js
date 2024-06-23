import React, { useContext } from 'react'
import '../css/Auth.css'
import axios from 'axios'
import { useState } from 'react'
import AppConext from './AppContext.js'
import { useNavigate } from 'react-router'


export default function Register() {
  const { dispatch } = useContext(AppConext)
  const [userInput, setUserInput] = useState({ name: "", email: "", password: "" })
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useNavigate()
  const onChangeHandle = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value })
  }
  const onSubmitHandle = async (e) => {
    try {
      e.preventDefault();
      const option = {
        method: 'post',
        url: "/api/v1/auth/register",
        data: userInput
      }
      const response = await axios(option)
      const { token, userName } = response.data.data
      localStorage.setItem('token', token)
      dispatch({ type: "CURRENT_USER", payload: { userName } })
      history("/")
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(Array.isArray(error.response.data.message) ? error.response.data.message.join(', ') : error.response.data.message);
      } else {
        setErrorMessage('Passoword must be at least 6 characters');
      }
    }
  }

  return (
    <div>
      <section className="auth-container">
        <form className="auth-form" onSubmit={onSubmitHandle}>
          <h2>Register new account</h2>
          {errorMessage &&
            (Array.isArray(errorMessage) ? (
              errorMessage.map((err) => (
                <div className="error-message">Error: {err}</div>
              ))
            ) : (
              <div className="error-message">Error: {errorMessage}</div>
            ))}
          <input type="text" name="name" id="" placeholder="Name" value={userInput.name} onChange={onChangeHandle} />
          <input type="email" name="email" id="" required placeholder="Email" value={userInput.email} onChange={onChangeHandle} />
          <input type="password" name="password" id="" required placeholder="Password" value={userInput.password} onChange={onChangeHandle} />
          <button className="btn" type="submit">Register</button>
        </form>
      </section>
    </div>
  )
}
