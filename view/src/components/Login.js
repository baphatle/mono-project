import React, { useContext } from 'react'
import '../css/Auth.css'
import axios from 'axios'
import AppConext from './AppContext.js'
import { useNavigate } from 'react-router'
import { useState } from 'react'

export default function Login() {
    const { dispatch } = useContext(AppConext)
    const [userInput, setUserInput] = useState({ email: "", password: "" })
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
                url: "api/v1/auth/login",
                data: userInput
            }
            const response = await axios(option)
            const { token, userName } = response.data.data
            localStorage.setItem('token', token)
            dispatch({ type: "CURRENT_USER", payload: { userName } })
            history("/")
            window.location.reload()
        } catch (error) {
            setErrorMessage(error.response.data.message)
        }
    }
    return (
        <div>
            <section className="auth-container" onSubmit={onSubmitHandle}>
                <form className="auth-form">
                    <h2>Enter your account</h2>
                    {errorMessage && (
                        <div className="error-message">Error: {errorMessage}</div>
                    )}
                    <input type="email" name="email" id="" required placeholder="Email" value={userInput.email}
                        onChange={onChangeHandle} />
                    <input type="password" name="password" id="" required placeholder="Password" value={userInput.password}
                        onChange={onChangeHandle} />
                    <button className="btn" type="submit">Login</button>
                </form>
            </section>
        </div>
    )
}
