import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { eventStartDelete } from '../../../actions/events';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';

jest.mock('../../../actions/events', () => {
    return {
        eventStartDelete: jest.fn(),
    }
})

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};

const store = mockStore(initState);
// Se crea un mock, porque no se va evaluar lo que hace la función,
// Sino se asegura que la accion se haya ejecutado
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <DeleteEventFab />
    </Provider>
);

describe('Pruebas en DeleteEventFab', () => {

    test('Debe de mostrarse correctamente', () => {

        expect(wrapper).toMatchSnapshot();

    });

    test('Debe de llamar al evento eventStartDelete', () => {

        wrapper.find('button').prop('onClick')();

        // Para asegurarse que se haya llamado la accion correcta
        expect(eventStartDelete).toHaveBeenCalled();

    });


});
