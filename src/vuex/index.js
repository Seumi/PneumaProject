import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'


Vue.use(Vuex);

const state = {
    token: window.sessionStorage.getItem('token'),
    username: window.sessionStorage.getItem('username'),
    userID: window.sessionStorage.getItem('userID')
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});

