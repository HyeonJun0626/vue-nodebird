export const state = () => ({
    
});

export const mutations = {
    bye(state) {
        state.hello = 'googbye';
    }
};

export const actions = {
    nuxtServerInit({ commit, dispatch, state }, { req }) {
        return dispatch('users/loadUser');
    }
}