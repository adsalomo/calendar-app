import { fetchNoToken, fetchWithToken } from '../../helpers/fetch';

describe('Prueba fetch.js', () => {

    test('Fetch sin token', async () => {

        const resp = await fetchNoToken('auth',
            { email: 'elena@gmail.com', password: '123456*' },
            'POST'
        );

        expect(resp instanceof Response).toBe(true);

    });

    test('Fetch con token', async () => {

        let resp = await fetchNoToken('auth',
            { email: 'elena@gmail.com', password: '123456*' },
            'POST'
        );

        let body = await resp.json();
        const { token } = body;

        localStorage.setItem('token', token);

        resp = await fetchWithToken('events/5ff09928fa95500f209f1878', {}, 'DELETE');

        body = await resp.json();

        expect(body.msg).toBe('Evento no existe por ese id');

    });

});
