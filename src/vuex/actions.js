export default {
    Login({ commit }, data) {
        commit('LOGIN', data);
    },
    Logout({ commit }) {
        commit('LOGOUT');
    }
}