export default function reducer(state, action) {
    switch (action.type) {
        case "CURRENT_USER":
            return {
                ...state,
                user: action.payload ? {
                    userId: action.payload.userId,
                    userName: action.payload.userName,
                } : null,
            };
        case "GET_ALL_POSTS":
            return { ...state, posts: action.payload };
        case "CREATE_ONE_POST":
            return { ...state, posts: [action.payload, ...state.posts] };
        case "UPDATE_POST":
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === action.payload._id
                        ? { ...post, ...action.payload }
                        : post
                ),
            };
        case "DELETE_POST":
            return {
                ...state,
                posts: state.posts.filter((post) => post._id !== action.payload._id)
            };
        case "LIKE_POST":
            console.log("LIKE_POST action.payload:", action.payload);
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === action.payload._id
                        ? {
                            ...post,
                            likes: action.payload.likes,
                            likeCount: action.payload.likeCount
                        }
                        : post
                ),
            };
        case "ADD_COMMENT":
            console.log("ADD_COMMENT action.payload:", action.payload);
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === action.payload._id
                        ? {
                            ...post,
                            comments: action.payload.comments
                        }
                        : post
                ),
            };
        default:
            return state;
    }
}   