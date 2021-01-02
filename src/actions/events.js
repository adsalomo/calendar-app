import Swal from "sweetalert2";
import { fetchWithToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types"

export const eventStartAddNew = (event) => {
    return async (distpatch, getState) => {

        const { uid, name } = getState().auth;

        try {
            const resp = await fetchWithToken('events', event, 'POST');
            const body = await resp.json();

            if (!body.ok) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                event.id = body.evento.id;
                event.user = {
                    _id: uid,
                    name,
                }

                distpatch(eventAddNew(event));
            }

        } catch (error) {
            Swal.fire('Error', 'Error back', 'error');
        }

    }
};

const eventAddNew = (event) => {
    return {
        type: types.eventAddNew,
        payload: event,
    }
};

export const eventSetActive = (event) => {
    return {
        type: types.eventSetActive,
        payload: event,
    }
};

export const eventClearActiveEvent = () => {
    return {
        type: types.eventClearActiveEvent
    }
};

export const eventStartUpdate = (event) => {
    return async (distpatch) => {

        try {

            const resp = await fetchWithToken(`events/${event.id}`, event, 'PUT');
            const body = await resp.json();

            if (!body.ok) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                distpatch(eventUpdated(event));
            }

        } catch (error) {
            Swal.fire('Error', 'Error back', 'error');
        }

    }
};

const eventUpdated = (event) => {
    return {
        type: types.eventUpdated,
        payload: event,
    }
};

export const eventStartDelete = () => {
    return async (distpatch, getState) => {

        const { activeEvent: event } = getState().calendar;

        try {

            const resp = await fetchWithToken(`events/${event.id}`, {}, 'DELETE');
            const body = await resp.json();

            if (!body.ok) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                distpatch(eventDeleted());
            }

        } catch (error) {
            Swal.fire('Error', 'Error back', 'error');
        }
    }
}

const eventDeleted = () => {
    return {
        type: types.eventDeleted,
    }
};

export const eventStartLoading = () => {
    return async (dispatch) => {
        try {

            const resp = await fetchWithToken('events');
            const body = await resp.json();

            const events = prepareEvents(body.eventos);

            dispatch(eventLoaded(events));

        } catch (error) {
            Swal.fire('Error', 'Error back', 'error');
        }
    }
};

const eventLoaded = (events) => {
    return {
        type: types.eventLoaded,
        payload: events
    }
};

export const eventLogout = () => {
    return {
        type: types.eventLogout,
    }
};

