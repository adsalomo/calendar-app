import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moment from 'moment';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';

import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../../actions/events';

jest.mock('sweetalert2', () => {
    return {
        fire: jest.fn(),
    }
});

jest.mock('../../../actions/events', () => {
    return {
        eventStartUpdate: jest.fn(),
        eventClearActiveEvent: jest.fn(),
        eventStartAddNew: jest.fn(),
    }
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlusOne = now.clone().add(1, 'hours');

const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'Hola mundo',
            notes: 'Algunas notas',
            start: now.toDate(),
            end: nowPlusOne.toDate(),
        }
    },
    auth: {
        uid: '123'
    },
    ui: {
        modalOpen: true,
    }
};

const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <CalendarModal />
    </Provider>
);

describe('Prueba <CalendarModal />', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debe de mostrar el modal', () => {

        //expect(wrapper.find('.modal').exists()).toBe(true);
        //console.log(process.env.NODE_ENV !== 'test');
        expect(wrapper.find('Modal').prop('isOpen')).toBe(true);

    });

    test('Debe de llamar la accion de actualizar y cerrar modal', () => {

        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        // No funciona
        /*
        act(() => {
            wrapper.find('form').prop('onSubmit')({ preventDefault() { } });
        });
        */

        expect(eventStartUpdate).toHaveBeenCalledWith(initState.calendar.activeEvent);

        expect(eventClearActiveEvent).toHaveBeenCalled();
    });

    // Para esta prueba es necesario limpiar los mocks, ya que
    // sino se hace, entonces la prueba fallará, porque la anterior prueba
    // si tiene el titulo seteado
    // *** El campo se limpia con la anterior prueba ****
    test('Debe de mostrar error si falta el titulo', () => {
        //console.log(wrapper.find('input[name="title"]').prop('value'));

        // Diferente cuando se llama por el prop
        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        /*
        act(() => {
            wrapper.find('form').prop('onSubmit')({ preventDefault() { } });
        });
        */

        expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true);

    });

    test('Debe de crear un nuevo evento', () => {

        const initState = {
            calendar: {
                events: [],
                activeEvent: null,
            },
            auth: {
                uid: '123'
            },
            ui: {
                modalOpen: true,
            }
        };

        const store = mockStore(initState);
        store.dispatch = jest.fn();


        const wrapper = mount(
            <Provider store={store}>
                <CalendarModal />
            </Provider>
        );

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas',
            }
        });

        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        expect(eventStartAddNew)
            .toHaveBeenCalledWith({
                end: expect.anything(),
                start: expect.anything(),
                title: 'Hola pruebas',
                notes: ''
            });

        expect(eventClearActiveEvent).toHaveBeenCalled();

    });


    test('Debe de validar las fechas', () => {

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas',
            }
        });

        const hoy = new Date();

        act(() => {

            wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy);

        });

        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        expect(Swal.fire).toHaveBeenCalledWith('Error', 'Fecha 2 debe ser mayor', 'error');

    })


});
