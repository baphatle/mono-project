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
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === action.payload._id
                        ? { ...post, likes: action.payload.likes }
                        : post
                ),
            };
        default:
            return state;
    }
}   