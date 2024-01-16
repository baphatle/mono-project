import React, { useContext } from 'react'
import '../css/Header.css'
import { Link } from 'react-router-dom'
import AppConext from './AppContext.js'

export default function Header() {
    const { state, dispatch } = useContext(AppConext)
    const { user } = state
    const signOut = () => {
        localStorage.removeItem("token")
        dispatch({ type: "CURRENT_USER", payload: null })
    }
    return (
        <div>
            <header className="header">
                <h1 className="logo"><Link to="/">Mono</Link></h1>
                <nav>
                    <ul className="main-nav">
                        {user ? (
                            <>
                                <li>
                                    <span className="user-name">Hello, {user.userName}</span>
                                </li>
                                <li onClick={() => signOut()}>
                                    <a>Sign out</a>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                                <li>
                                    <li><Link to="/register">Register</Link></li>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
        </div>
    )
}
