import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGOUT_USER: "LOGOUT_USER",
    LOGIN_USER: "LOGIN_USER",
    ERROR_MODAL: "ERROR_MODAL",
    CLOSE_MODAL: "CLOSE_MODAL"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorText: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorText: null
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorText: null
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorText: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorText: false
                })
            }
            case AuthActionType.ERROR_MODAL: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    errorText: payload
                })
            }
            case AuthActionType.CLOSE_MODAL: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    errorText: null
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userData, store) {
        try {
            const response = await api.registerUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            } else {
                authReducer({
                    type: AuthActionType.ERROR_MODAL,
                    payload: response.data.errorMessage
                })
            }
        } catch (error) {
            if (error.response.status === 400) {
                authReducer({
                    type: AuthActionType.ERROR_MODAL,
                    payload: error.response.data.errorMessage
                })
            }
        }
    }

    auth.loginUser = async function (loginForm, state) {
        try {
            const resp = await api.loginUser(loginForm);
            if (resp.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: resp.data.user
                    }
                })
                history.push("/");
                state.loadIdNamePairs();
            }
        }
        catch (error) {
            if (error.response.status === 400){
                authReducer({
                    type: AuthActionType.ERROR_MODAL,
                    payload: error.response.data.errorMessage
                })
            }
        }
    }

    auth.logoutUser = async function () {
        try {
            const resp = await api.logoutUser();
            if (resp.status === 200) {
                authReducer({
                    type: AuthActionType.LOGOUT_USER,
                    payload: null
                })
                history.push("/");
            }
        } catch (err){
            console.log(err);
        }
    }

    auth.closeModal = async function () {
        authReducer({
            type: AuthActionType.CLOSE_MODAL,
            payload: null
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };