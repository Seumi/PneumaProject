import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import createToken from './token/createToken';

export default {
    bootstrap() {
        let mock = new MockAdapter(axios);

        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        });

        mock.onPost('/login').reply(config => {
            let { username, password } = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if(username === 'test' && password === '123') {
                        let token = createToken(username);
                        resolve([200, { code: 200, msg: '请求成功', token: token}]); 
                    } else {
                        resolve([200, { code: 400, msg: '登录失败'}]);
                    }
                }, 1000)
            })
        })
    }
}