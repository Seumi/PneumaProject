const mutations = {
    LOGIN(state, data) {
        state.token = data.token;
        window.sessionStorage.setItem('token', data.token);
        state.username = data.username;
        window.sessionStorage.setItem('username', data.username);
        state.userID = data.userID;
        window.sessionStorage.setItem('userID', data.userID);
    },
    LOGOUT(state) {
        state.token = null;
        state.username = null;
        state.userID = null;
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('username');
        window.sessionStorage.removeItem('userID');
    }
}

export default mutations;