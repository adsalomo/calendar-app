import { uiReducer } from '../../reducers/uiReducer';
import { types } from '../../types/types';

const initState = {
    modalOpen: false,
}

describe('Pruebas uiReducer', () => {

    test('Debe de retornar el estado por defecto', () => {

        const state = uiReducer(initState, {});
        expect(state).toEqual(initState);

    });

    test('Debe de abrir y cerrar el modal', () => {

        const modalOpen = {
            type: types.uiOpenModal,
            payload: true,
        };

        let state = uiReducer(initState, modalOpen);

        expect(state).toEqual({ modalOpen: true });

        const modalClose = {
            type: types.uiCloseModal,
            payload: true,
        }

        state = uiReducer(initState, modalClose);

        expect(state).toEqual({ modalOpen: false });

    });

});
