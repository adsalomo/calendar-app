import { types } from '../types/types';

export const uiOpenModal = () => {
    return {
        type: types.uiOpenModal,
        payload: true,
    }
};

export const uiCloseModal = () => {
    return {
        type: types.uiCloseModal,
        payload: true,
    }
};