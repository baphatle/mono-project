import React, { useContext, useState } from 'react'
import axios from 'axios'
import AppConext from './AppContext.js'

export default function PostItem({ post }) {
    const { dispatch } = useContext(AppConext)
    const [postToEdit, setPostToEdit] = useState(post)
    const [openEditForm, setOpenEditForm] = useState(false)
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
    let date = new Date(post.createdAt)

    const updatePost = async () => {
        try {
            setOpenEditForm(false)
            const token = localStorage.getItem('token')
            const option = {
                method: 'put',
                url: `/api/v1/post/${post._id}`,
                data: postToEdit,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            await axios(option)
            dispatch({ type: "UPDATE_POST", payload: { ...postToEdit } })
        } catch (error) {
            console.log(error.response)
        }
    }

    const deletePost = async () => {
        try {
            const token = localStorage.getItem('token')
            const option = {
                method: 'delete',
                url: `/api/v1/post/${post._id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            await axios(option)
            dispatch({ type: "DELETE_POST", payload: { _id: post._id } })
        } catch (error) {
            console.log(error.response)
        }
    }

    return (
        <div>
            <div className="post-item">
                <p className="post-content">
                    {post.content}
                </p>
                <div className="post-footer">
                    <div className="post-footer">
                        <div className="post-infors">
                            <span>by {post.author.name}</span>
                            <span>Date: {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</span>
                        </div>
                    </div>
                    {post.isEditable && (
                        <div className="post-edit-delete">
                            {openDeleteConfirm ? (
                                <>
                                    <span className="delete-question">Are you sure?</span>
                                    <span onClick={deletePost} >Yes</span>
                                    <span onClick={() => setOpenDeleteConfirm(false)}>No</span>
                                </>
                            ) : (
                                <>
                                    <span onClick={() => setOpenEditForm(true)} >Edit</span>
                                    <span onClick={() => setOpenDeleteConfirm(true)}>Delete</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {openEditForm && (
                    <div className="post-edit-form" >
                        <form className="edit-form">
                            <textarea type="text" name="content" id="content" className="content"
                                placeholder="What's happening?" value={postToEdit.content} const onChange={(e) => {
                                    setPostToEdit({ ...postToEdit, content: e.target.value })
                                }}></textarea>
                            <div className="btn-container">
                                <button className="btn" type="button" onClick={updatePost} >Update</button>
                                <button className="btn" type="button" onClick={() => setOpenEditForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
