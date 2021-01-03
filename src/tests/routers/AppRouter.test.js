import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppRouter } from '../../routers/AppRouter';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Prueba <AppRouter />', () => {

    test('Debe mostrarse correctamente', () => {

        const initState = {
            auth: {
                checking: true,
            }
        };

        const store = mockStore(initState);

        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        expect(wrapper).toMatchSnapshot();

    });

    test('Debe de mostrar la ruta publica', () => {

        const initState = {
            auth: {
                checking: false,
            }
        };

        const store = mockStore(initState);

        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        expect(wrapper).toMatchSnapshot();

        // La ruta publica tiene el div con la clase login-container
        expect(wrapper.find('.login-container').exists()).toBe(true);

    });

    test('Debe de mostrar la ruta privada', () => {

        const initState = {
            auth: {
                checking: false,
                uid: '123'
            },
            calendar: {
                events: [],
                activeEvent: null,
            },
            ui: {
                modalOpen: false,
            }
        };

        const store = mockStore(initState);

        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        expect(wrapper).toMatchSnapshot();

        // La ruta publica tiene el div con la clase calendar-screen
        expect(wrapper.find('.calendar-screen').exists()).toBe(true);

    });

});
