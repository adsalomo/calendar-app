import Swal from "sweetalert2";
import { fetchNoToken, fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";
import { eventLogout } from "./events";

export const startLogin = (email, password) => {
    return async (dispatch) => {

        const resp = await fetchNoToken('auth', { email, password }, 'POST');
        const body = await resp.json();

        if (!body.ok) {
            Swal.fire('Error', body.msg, 'error');
        } else {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(login({ uid: body.uid, name: body.name }));
        }

    }
};

export const startRegister = (name, email, password) => {
    return async (dispatch) => {

        const resp = await fetchNoToken('auth/new', { name, email, password }, 'POST');
        const body = await resp.json();

        if (!body.ok) {
            Swal.fire('Error', body.msg, 'error');
        } else {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(login({ uid: body.uid, name: body.name }));
        }

    }
};

export const startChecking = () => {
    return async (dispatch) => {

        const resp = await fetchWithToken('auth/renew');
        const body = await resp.json();

        if (!body.ok) {
            //Swal.fire('Error', body.msg, 'error');
            dispatch(checkingFinish());
        } else {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(login({ uid: body.uid, name: body.name }));
        }

    }
};

const checkingFinish = () => {
    return {
        type: types.authCheckingFinish,
    }
}

const login = (user) => {
    return {
        type: types.authLogin,
        payload: user,
    }
};

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();
        dispatch(eventLogout());
        dispatch(logout());
    }
};

export const logout = () => {
    return {
        type: types.authLogout,
    }
}