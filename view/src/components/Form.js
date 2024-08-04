import React, { useContext, useState } from 'react'
import '../css/Form.css'
import axios from 'axios'
import AppConext from './AppContext.js'

export default function Form() {
    const { state, dispatch } = useContext(AppConext)
    const { user } = state
    const [postInput, setPostInput] = useState({ content: "" })
    const [errorMessage, setErrorMessage] = useState(null)
    const [hasContent, setHasContent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostInput({ ...postInput, [name]: value });
        setHasContent(!!value.trim());
    }

    const onSubmitHandle = async (e) => {
        try {
            e.preventDefault()
            const token = localStorage.getItem('token')
            const option = {
                method: 'post',
                url: '/api/v1/post/',
                data: postInput,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const response = await axios(option)
            const { post } = response.data.data
            const author = { _id: post.author, name: user.userName }
            dispatch({ type: "CREATE_ONE_POST", payload: { ...post, author, isEditable: true } })
            setPostInput({ content: "" })
            setHasContent(false);
        } catch (error) {
            setErrorMessage(error.response.data.message)
        }
    }
    return (
        <section className="form-section">
            {user ? (
                <form className="form" onSubmit={onSubmitHandle}>
                    {errorMessage && (
                        <div className="error-message">Error: {errorMessage}</div>
                    )}
                    <textarea
                        type="text"
                        name="content"
                        id="content"
                        className="content"
                        placeholder="Bạn đang nghĩ gì?"
                        value={postInput.content}
                        onChange={handleChange}
                    ></textarea>
                    {hasContent && ( 
                        <button className="btn" type="submit">
                            Đăng
                        </button>
                    )}
                </form>
            ) : (
                <>
                    <h3>All Posts:</h3>
                </>
            )}
        </section>
    )
}


