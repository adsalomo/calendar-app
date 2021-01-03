import { authReducer } from "../../reducers/authReducer";
import { types } from "../../types/types";

describe('Prueba authReducer', () => {

    test('Debe retornar el estado por defecto', () => {

        const initialState = {
            checking: true,
        };

        const state = authReducer(initialState, {});

        expect(state).toEqual(initialState);

    });

    test('Debe retornar el estado authLogin', () => {

        const initialState = {
            checking: true,
        };

        const actionLogin = {
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'test',
            }
        };

        const state = authReducer(initialState, actionLogin);

        expect(state).toEqual({
            uid: '123',
            name: 'test',
            checking: false,
        });

    });


});
