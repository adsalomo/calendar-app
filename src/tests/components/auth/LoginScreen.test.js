import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/auth';

jest.mock('sweetalert2', () => {
    return {
        fire: jest.fn(),
    }
});

jest.mock('../../../actions/auth', () => {
    return {
        startLogin: jest.fn(),
        startRegister: jest.fn(),
    }
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};

const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <LoginScreen />
    </Provider>
);

describe('Pruebas en <LoginScreen />', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('Debe mostrarse correctamente', () => {

        expect(wrapper).toMatchSnapshot();

    });

    test('Debe de llamar el dispatch del login', () => {

        wrapper.find('input[name="lEmail"]').simulate('change', {
            target: {
                name: 'lEmail',
                value: 'millito@gmail.com',
            }
        });

        wrapper.find('input[name="lPasword"]').simulate('change', {
            target: {
                name: 'lPasword',
                value: '123456*',
            }
        });

        wrapper.find('form').at(0).prop('onSubmit')({
            preventDefault() { }
        });

        expect(startLogin).toHaveBeenCalledWith('millito@gmail.com', '123456*');

    });

    test('No hay registro si las constraseñas son diferentes', () => {

        wrapper.find('input[name="rPasword"]').simulate('change', {
            target: {
                name: 'rPasword',
                value: '123456',
            }
        });

        wrapper.find('input[name="rPasword2"]').simulate('change', {
            target: {
                name: 'rPasword2',
                value: '123456*',
            }
        });

        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault() { }
        });

        expect(startRegister).not.toHaveBeenCalled();

        expect(Swal.fire)
            .toHaveBeenCalledWith('Error',
                'Las contraseñas deben de ser iguales',
                'error'
            );
    });

    test('Registro con contraseñas iguales', () => {

        wrapper.find('input[name="rPasword"]').simulate('change', {
            target: {
                name: 'rPasword',
                value: '123456*',
            }
        });

        wrapper.find('input[name="rPasword2"]').simulate('change', {
            target: {
                name: 'rPasword2',
                value: '123456*',
            }
        });

        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault() { }
        });

        expect(Swal.fire).not.toHaveBeenCalled();

        expect(startRegister)
            .toHaveBeenCalledWith('Pepito', 'pepito@gmail.com', '123456*');
    });


});
