import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { messages } from '../../../helpers/calendar-messages-es';
import { types } from '../../../types/types';
import { eventSetActive } from '../../../actions/events';
import { act } from 'react-dom/test-utils';

jest.mock('../../../actions/events', () => {
    return {
        eventSetActive: jest.fn(),
        eventStartLoading: jest.fn(),
    }
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {
    calendar: {
        events: []
    },
    auth: {
        uid: '123'
    },
    ui: {
        modalOpen: false,
    }
};

const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <CalendarScreen />
    </Provider>
);

// Mock localStorage
Storage.prototype.setItem = jest.fn();

describe('Pruebas CalendarScreen', () => {

    test('Debe de mostrar el componente', () => {

        expect(wrapper).toMatchSnapshot();

    });

    test('Pruebas con las iteracciones del calendario', () => {

        const calendar = wrapper.find('Calendar');

        // mensajes del calendar
        const calendarMessages = calendar.prop('messages');
        expect(calendarMessages).toEqual(messages);

        // Evento double click
        calendar.prop('onDoubleClickEvent')();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: types.uiOpenModal,
            payload: true,
        });

        // Evento onSelect
        calendar.prop('onSelectEvent')({});
        expect(eventSetActive).toHaveBeenCalledWith({});

        // Evento cambio de vista calendario
        // LLama al localStorage para guardar la vista actual
        // Cuando la acción hace una modificacion en el state,
        // Entonces se debe colocar dentro del act
        act(() => {

            calendar.prop('onView')('week');

        });

        expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week');

    });


});
