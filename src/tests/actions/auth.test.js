import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';

jest.mock('sweetalert2', () => {
    return {
        fire: jest.fn(),
    }
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};

let store = mockStore(initState);

// Mock localStorage
// Aca no funciona como en fetch.test.js
// Para setear al local storage, porque estamos haciendo uso del
// Local Storare como un mock
Storage.prototype.setItem = jest.fn();

describe('Prueba action auth', () => {

    beforeEach(() => {
        store = mockStore(initState);
        // Cuando se usan funciones de jest
        jest.clearAllMocks();
    });

    test('Start login successfull', async () => {

        await store.dispatch(startLogin('elena@gmail.com', '123456*'));

        const actions = store.getActions();

        expect(actions[0].type).toBe(types.authLogin);

        // Se verifica porque cuando se llama el startLogin
        // se hace uno del localStorage
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.setItem)
            .toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem)
            .toHaveBeenCalledWith('token-init-date', expect.any(Number));

        // Las veces en que se llamo con sus respectivos args
        //console.log(localStorage.setItem.mock.calls);
    });

    test('StartLogin incorrecto', async () => {

        // Falla el email
        await store.dispatch(startLogin('welena@gmail.com', '123456*'));

        const actions = store.getActions();

        // Las acciones son vacias cuando falla el login
        expect(actions).toEqual([]);

        // Espero que se llame el Swal
        expect(Swal.fire).toHaveBeenCalled();
        expect(Swal.fire)
            .toHaveBeenCalledWith('Error', 'El usuario no existe con ese email', 'error');

    });

    test('StartRegister correcto', async () => {

        fetchModule.fetchNoToken = jest.fn(() => {
            return {
                json() {
                    return {
                        ok: true,
                        uid: '123',
                        name: 'Miriam',
                        token: 'abc123',
                    }
                }
            }
        });

        await store.dispatch(startRegister('Test', 'test@test.com', '123456*'));

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: { uid: '123', name: 'Miriam' }
        });

        expect(localStorage.setItem)
            .toHaveBeenCalledWith('token', expect.any(String));

        expect(localStorage.setItem)
            .toHaveBeenCalledWith('token-init-date', expect.any(Number));

    });

    test('StartChecking correcto', async () => {
        fetchModule.fetchWithToken = jest.fn(() => {
            return {
                json() {
                    return {
                        ok: true,
                        uid: '123',
                        name: 'Miriam',
                        token: 'abc123',
                    }
                }
            }
        });

        await store.dispatch(startChecking());

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: { uid: '123', name: 'Miriam' }
        });

        expect(localStorage.setItem)
            .toHaveBeenCalledWith('token', 'abc123');
    });


});
