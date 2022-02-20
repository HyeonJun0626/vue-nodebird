export const state = () => ({
    me: null,
    followerList: [],
    followingList: [],
    hasMoreFollower: true,
    hasMoreFollowing: true,
    other: null
});

const totalFollowers = 8
const totalFollowings = 6
const limit = 3

export const mutations = {
    setMe(state, payload) {
        console.log(payload)
        state.me = payload;
    },
    setOther(state, payload) {
        state.other = payload;
    },
    changenickname(state, payload) {
        state.me.nickname = payload.nickname;
    },
    addFollower(state, payload) {
        state.followerList.push(payload)
    },
    addFollowing(state, payload) {
        state.followingList.push(payload)
    },
    removeFollower(state, payload) {
        let index = state.me.Followers.findIndex( v => v.id === payload.userId);
        state.me.Followers.splice(index, 1);
        index = state.followerList.findIndex( v => v.id === payload.id);
        state.followingList.splice(index, 1);
    },
    removeFollowing(state, payload) {
        let index = state.me.Followings.findIndex( v => v.id === payload.userId);
        state.me.Followings.splice(index, 1);
        index = state.followerList.findIndex( v => v.id === payload.userId);
        state.followingList.splice(index, 1);
    },
    loadFollowings(state, payload) {
        // const diff = totalFollowings - state.followingList.length
        // const fakeUsers = Array( diff > limit ? limit : diff).fill().map(v => ({
        //     id: Math.random().toString(),
        //     nickname: Math.floor( Math.random() * 1000),
        // }))
        // state.followingList = state.followingList.concat(fakeUsers)
        // state.hasMoreFollowing = fakeUsers.length === limit
        if (payload.offset === 0) {
            state.followingList = payload.data;
        } else {
            state.followingList = state.followingList.concat(payload.data)
        }
        state.hasMoreFollowing = payload.data.length === limit
    },
    loadFollowers(state, payload) {
        // const diff = totalFollowers - state.followerList.length
        // const fakeUsers = Array( diff > limit ? limit : diff).fill().map(v => ({
        //     id: Math.random().toString(),
        //     nickname: Math.floor( Math.random() * 1000),
        // }))
        // state.followerList = state.followerList.concat(fakeUsers)
        // state.hasMoreFollower = fakeUsers.length === limit
        if (payload.offset === 0) {
            state.followerList = payload.data;
        } else {
            state.followerList = state.followerList.concat(payload.data);
        }
        state.hasMoreFollower = payload.data.length === limit        
    },
    following(state, payload) {
        state.me.Followings.push({id: payload.userId});
    },

};

export const actions = {
    async loadUser({ commit }) {

        try {
            const res = await this.$axios.get('http://localhost:3085/user', {
                withCredentials: true,
            })
            commit('setMe', res.data);
        } catch (err) {
            console.log('여기요 !@#!@#!@#!#!@#!@')
            console.log(err)
        }
        // .then( (res) => {
        //     commit('setMe', res.data);
        // })
        // .catch( (err) => {
        //     console.error(err);
        // })
    },
    async loadOther({ commit }, payload) {
        try {
            const res = await this.$axios.get(`http://localhost:3085/user/${payload.userId}`, {
                withCredentials: true,
            });
            commit('setOther', res.data);
        } catch (err) {
            console.error(err);
        }
    },
    // actions에는 context, payload로 구성
    // context는 객체, 안에는 commit dispatch, state, rootState, getters, rootGetters가 있음
    // rootState, rootGetters는 index 모듈의 state, getters임
    signUp({commit}, payload) {
        return this.$axios.post('http://localhost:3085/user', {
            email: payload.email,
            nickname: payload.nickname,
            password: payload.password
        }, {
            withCredentials: true,
        }).then((res) => {
            commit('setMe', res.data)
        }).catch((err) => {
            console.error(err);
        })
    },
    logIn({commit}, payload) {
        return this.$axios.post('http://localhost:3085/user/login', {
            email: payload.email,
            password: payload.password
        }, {
            withCredentials: true,
        }).then((res) => {
            commit('setMe', res.data)
        }).catch((err) => {
            console.error(err);
        })
    },
    logOut({commit}, payload) {
        return this.$axios.post('http://localhost:3085/user/logout', {}, {
            withCredentials: true,
        })
            .then((res) => {
                commit('setMe', null)
            })
            .catch((err) => {
                console.error(err);
            })
    },
    changenickname({commit}, payload) {
        return this.$axios.patch(`/user/nickname`, {
            nickname: payload.nickname
        }, {
            withCredentials: true,
        })
        .then(() => {
            commit('changenickname', payload)
        })
        .catch((err) => {
            console.error(err);
        }) 
    },
    addFollowing({commit}, payload) {
        commit('addFollowing', payload)
    },
    addFollower({commit}, payload) {
        commit('addFollower', payload)
    },
    loadFollowers({ commit, state }, payload) {
        if (!(payload && payload.offset === 0) && !state.hasMoreFollower) {
            return;
        }
        let offset = state.followerList.lenght;
        if (payload && payload.offset === 0) {
            offset = 0;
        }
        return this.$axios.get(`/user/${state.me.id}/followers?limit=3&offset=${offset}`, {
            withCredentials: true,
        })
        .then((res) => {
            commit('loadFollowers', {
                data: res.data,
                offset,
            })
        })
        .catch((err) => {
            console.error(err);
        })
        
    },
    loadFollowings({ commit, state }, payload) {
        if (!(payload && payload.offset === 0) && !state.hasMoreFollowing) {
            return;
        }
        let offset = state.followingList.lenght;
        if (payload && payload.offset === 0) {
            offset = 0;
        }
        return this.$axios.get(`/user/${state.me.id}/followings?limit=3&offset=${offset}`, {
            withCredentials: true,
        })
        .then((res) => {
            commit('loadFollowings', {
                data: res.data,
                offset,
            })
        })
        .catch((err) => {
            console.error(err);
        })
    },
    follow( { commit }, payload ) {
        return this.$axios.post(`/user/${payload.userId}/follow`, {}, {
            withCredentials: true,
        })
        .then((res) => {
            commit('following', {
                userId: payload.userId,
            })
        })
        .catch((err) => {
            console.error(err);
        })
    },
    unfollow({ commit }, payload) {
        return this.$axios.delete(`/user/${payload.userId}/follow`, {
            withCredentials: true,
        })
        .then((res) => {
            commit('removeFollowing', {
                userId: payload.userId,
            })
        })
        .catch((err) => {
            console.error(err);
        })
    },
    removeFollower({ commit }, payload) {
        return this.$axios.delete(`/user/${payload.userId}/follower`, {
            withCredentials: true,
        })
        .then((res) => {
            commit('removeFollower', {
                userId: payload.userId,
            })
        })
        .catch((err) => {
            console.error(err);
        })
    },
    
};