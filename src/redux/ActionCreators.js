import * as ActionTypes from './ActionTypes';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';

//POSTS
export const fetchPosts = () => async (dispatch) => {
    dispatch(postLoading());

    axios.get(baseUrl + '/api/')
    .then(response => {
        //console.log(response);
        return response;
    })
    .then(posts => dispatch(addPost(posts.data)))
    .catch(error => {
        console.log(error);
        dispatch(postFailed(error));
    });
}

export const postLoading = () => ({
    type: ActionTypes.POST_LOADING
});

export const postFailed = (errmess) => ({
    type: ActionTypes.POST_FAILED,
    payload: errmess
});

export const addPost = (post) => ({
    type: ActionTypes.ADD_POST,
    payload: post
});

export const postPost = (post) => (dispatch, getState) => {
    console.log(post.title);
    console.log(post.body);
    console.log(getState());
    axios.post(baseUrl + '/api/', {
        title: post.title,
        body: post.body,
        owner: post.owner,
    })
    .then(res => {
        dispatch(fetchPosts());
        console.log(res);
        console.log("Question submitted successfully!");
    })
    .catch(error => console.log(error));
};

export const editPost = (post) => (dispatch, getState) => {
    console.log(post);
    axios.put(baseUrl + `/api/${post.id}/`, {
        title: post.title,
        body: post.body,
        owner: post.owner
    })
    .then(res => {
        console.log(res);
        console.log("Question updated successfully!");
        dispatch(fetchPosts());
    })
    .catch(error => console.log(error));
};

export const deletePost = (post, history) => (dispatch, getState) => {
    axios.delete(baseUrl + `/api/${post.id}/`)
    .then(res => {
        dispatch(fetchPosts());
        console.log(res);
        console.log("Question deleted successfully!");
        history.push('/questions');
    })
    .catch(error => console.log(error));
};

// AUTHENTICATION
export const requestLogin = (creds) => {
    return ({
        type: ActionTypes.LOGIN_REQUEST,
        creds
    });
}

export const loginSuccess = (response) => {
    return({
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.data.token,
        currentUserId: response.data.user_id,
        currentUser: response.data.username,
        currentUserEmail: response.data.email,
    });
}

export const loginError = (loginErrMessage) => {
    return({
        type: ActionTypes.LOGIN_FAILURE,
        errMess: loginErrMessage
    });
}

const checkAuthTimeout = expirationTime => dispatch => (
    dispatch(
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    )
);

export const loginUser = (creds) => async (dispatch) => {
    dispatch(requestLogin(creds));

    return await axios.post(baseUrl + '/user/login/', {
        username: creds.username,
        password: creds.password,
        //rememberMe: creds.rememberMe,
    })
    .then(res => {
        console.log(res.data.username);
        const token = res.data.token;
        const currentUserId = res.data.user_id;
        const currentUserEmail = res.data.email;
        const currentUser = res.data.username;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', currentUserId);
        localStorage.setItem('username', currentUser);
        localStorage.setItem('userEmail', currentUserEmail);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(loginSuccess(res));
        dispatch(fetchUser(token, currentUser));
        //dispatch(checkAuthTimeout(3600));
    })
    .catch(error => {
        dispatch(loginError(error));
    });
}

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const logoutSuccess = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

export const logout = () => (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    dispatch(logoutSuccess());
}

//SIGNUP
export const signupUser = (creds) => (dispatch) => {
    //console.log(creds);
    dispatch(requestLogin(creds));

    axios.post(baseUrl + '/user/register/', {
        username: creds.username,
        password1: creds.password1,
        password2: creds.password2,
        email: creds.email
    })
    .then(res => {
        console.log(res);
        const token = res.data.token;
        const currentUserId = res.data.user_id;
        const currentUserEmail = res.data.email;
        const currentUser = res.data.username;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', currentUserId);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('userEmail', currentUserEmail);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(loginSuccess(res));
        dispatch(fetchUser(token, currentUser));
        //dispatch(checkAuthTimeout(3600));
    })
    .catch(error => {
        console.log(error);
        dispatch(loginError(error));
    });
}

//RETREIVING USER INFORMATION
export const fetchUser = (token, currentUser) => (dispatch) => {
    dispatch(userLoading());

    axios.get(baseUrl + `/users/${currentUser}/`, {
        "headers": token !== null ? {Authorization: "Token " + token}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addUser(res));
    })
    .catch(error => {
        console.log(error);
        dispatch(userFailed(error));
    })
}

export const userLoading = () => ({
    type: ActionTypes.USER_LOADING
});

export const userFailed = (errmess) => ({
    type: ActionTypes.USER_FAILED,
    payload: errmess
});

export const addUser = (user) => ({
    type: ActionTypes.ADD_USER,
    payload: user
});

export const updateUser = (auth, username, firstname) => (dispatch) => {
    axios.put(baseUrl + `/users/${auth.currentUserId}/update/`, {
        username,
        first_name: firstname,
    },
    {
        "headers": auth.token !== null ? {Authorization: "Token " + auth.token}: undefined
    })
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    })
}