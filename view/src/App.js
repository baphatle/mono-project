import Header from "./components/Header.js";
import Main from "./components/Main.js"
import Register from "./components/Register.js"
import Login from "./components/Login.js"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppReducer from './reducer/AppReducer.js'
import { useCallback, useEffect, useReducer } from "react";
import AppContext from "./components/AppContext.js";
import axios from 'axios'

function App() {
  const initialState = { user: null, posts: [] }
  const [state, dispatch] = useReducer(AppReducer, initialState)
  const checkCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const option = {
        method: "get",
        url: "/api/v1/auth/",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios(option)
      if (response.data.data.user) {
        const { userId, userName, admin } = response.data.data.user
        dispatch({ type: "CURRENT_USER", payload: { userId, userName, admin} })
      }
    } catch (error) {
      console.log(error)
    }
  }, [dispatch])
  useEffect(() => {
    checkCurrentUser()
  }, [checkCurrentUser])
  return (
    <Router>
      <AppContext.Provider value={{ state, dispatch }}>
        <div className="Header">
          <Header />
        </div>
        <div className="Container">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </AppContext.Provider>
    </Router>

  );
}

export default App;
