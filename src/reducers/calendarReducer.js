import moment from 'moment';
import { types } from '../types/types';

const initialState = {
    events: [
        {
            id: new Date().getTime(),
            title: 'Cumpleaños',
            notes: 'Felicitar A Elena',
            start: moment().toDate(),
            end: moment().add(2, 'hours').toDate(),
            bgColor: '#fafafa',
            user: {
                _id: 1,
                name: 'Elena',
            }
        }
    ],
    activeEvent: null,
};

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.eventSetActive:
            return {
                ...state,
                activeEvent: action.payload
            }

        case types.eventAddNew:
            return {
                ...state,
                events: [...state.events, action.payload],
            }

        case types.eventClearActiveEvent:
            return {
                ...state,
                activeEvent: null,
            }

        case types.eventUpdated:
            return {
                ...state,
                events: state.events.map(
                    x => x.id === action.payload.id ? action.payload : x
                ),
            }

        case types.eventDeleted:
            return {
                ...state,
                events: state.events.filter(x => x.id !== state.activeEvent.id),
                activeEvent: null,
            }

        default:
            return state;
    }
}