
import throttle from 'lodash.throttle';

export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
    imagePaths: [],
});

const totalPosts = 51
const limit = 10

export const mutations = {
    addMainPost(state, payload) {
        // unshft 배열 앞에 붙임
        console.log(payload)
        state.mainPosts.unshift(payload);
        state.imagePaths = [];
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts.splice(index, 1);
    },
    loadComments(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload[0].PostId);
        state.mainPosts[index].comments = payload;
    },
    addComment(state, payload) {
        console.log(payload)
        const index = state.mainPosts.findIndex( v => v.id === payload.PostId);
        console.log(index)
        state.mainPosts[index].comments.unshift(payload);
    },
    loadPosts(state, payload) {
        // // 더미데이터
        // const diff = totalPosts - state.mainPosts.length;
        // const fakePosts = Array(diff > limit ? limit : diff).fill().map( v => ({
        //     id: Math.random().toString(),
        //     User: {
        //         id: 1,
        //         nickname: '제로초',
        //     },
        //     content: `Hello infinite scrolling~ ${Math.random()}`,
        //     Comments: [],
        //     Images: []
        // }))
        // state.mainPosts = state.mainPosts.concat(fakePosts);
        // state.hasMorePost = fakePosts.length === limit;
        if (payload.reset) {
            state.mainPosts = payload.data;
        } else {
            state.mainPosts = state.mainPosts.concat(payload);
        }
        state.hasMorePost = payload.length === 10;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePaths(state, payload) {
        state.imagePaths.splice(payload, 1);
    },
    unlikePost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        const userIndex = state.mainPosts[index].Likers.findIndex(v => v.id === payload.userId);
        state.mainPosts[index].Likers.splice(userIndex, 1);
    },
    likePost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].Likers.push({
            id: payload.userId,
        });
    }

};

export const actions = {
    add({ commit, state }, payload) {
        // index 스토어 모듈에 같은 mutations 이름이 있고 index 모듈의 mutations를 부르고 싶으면 root로 호출 가능
        // commit('addMainPost', payload, { root: true});
        this.$axios.post('http://localhost:3085/post', {
            content: payload.content,
            image: state.imagePaths,
        }, {
            withCredentials: true,
        })
        .then( (res) => {
            commit('addMainPost', res.data);
        })
        .catch( () => {

        })
    },
    remove({ commit }, payload) {
        this.$axios.delete(`http://localhost:3085/post/${payload.postId}`, {
            withCredentials: true,
        })
        .then ( () => {
            commit('removeMainPost', payload);
        })
        .catch( (err) => {
            console.error(err);
        })
    },
    async addComment({ commit }, payload) {
        const res = await this.$axios.post(`http://localhost:3085/post/${payload.postId}/comment`, {
            content: payload.content,
        }, {
            withCredentials: true
        })
        commit('addComment', res.data);
        // .then( (res) => {
        //     commit('addComment', res.data);
        // })
        // .catch( (err) => {
        //     console.error(err);
        // })
    },
    async loadComments({ commit }, payload) {
        console.log(payload)
        const res = await this.$axios.get(`http://localhost:3085/post/${payload.postId}/comments`)
        commit('loadComments', res.data);
        // .then( (res) => {
        //     commit('loadComments', res.data);
        // })
        // .catch( (err) => {
        //     console.error(err);
        // })
    },
    loadPosts: throttle( async function ({ commit, state }, payload) {
        
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/user/posts?limit=10`)
                commit('loadPosts', {
                    data: res.data,
                    reset: true
                });
                return;
            }
            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length -1];
                console.log(lastPost)
                const res = await this.$axios.get(`/posts?lastId=${lastPost && lastPost.id}&limit=10`)
                commit('loadPosts', {
                    data: res.data,
                    reset: true
                });
                return;
            }
            } catch (err) {
                console.log('포스트 불러오기 실패')
                console.error(err);
            }
    }, 3000),
    loadUserPosts: throttle( async function ({ commit, state }, payload) {
        
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/user/${payload.userId}/posts?limit=10`)
                commit('loadPosts', {
                    data: res.data,
                    reset: true
                });
                return;
            }
            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length -1];
                const res = await this.$axios.get(`/user/${payload.userId}/posts?lastId=${lastPost&&lastPost.id}&limit=10`)
                commit('loadPosts', {
                    data: res.data,
                    reset: true
                });
                return;
            }
            } catch (err) {
                console.log('포스트 불러오기 실패')
                console.error(err);
            }
            // .then( (res) => {
            //     console.log(res.data)
            //     commit('loadPosts', res.data);
            // })
            // .catch( (err) => {
            //     console.error(err);
            // })
    }, 3000),
    uploadImages({ commit }, payload) {
        this.$axios.post('http://localhost:3085/post/images', payload, {
            withCredentials: true,
        })
        .then( (res) => {
            commit('concatImagePaths', res.data);
        })
        .catch( (err) => {
            console.error(err);
        })
    },
    retweet({ commit }, payload) {
        this.$axios.post(`post/${payload.postId}/retweet`, {}, {
            withCredentials: true,
        })
        .then((res) => {
            commit('addMainPost', res.data);
        })
        .catch((err) => {
            console.error(err);
            alert(err.response.data);
        })
    },
    likePost({ commit }, payload) {
        this.$axios.post(`post/${payload.postId}/like`, {}, {
            withCredentials: true,
        })
        .then((res) => {
            commit('likePost', {
                userId: res.data.userId,
                postId: payload.postId,
            });
        })
        .catch((err) => {
            console.error(err);
        })
    },
    unlikePost({ commit }, payload) {
        this.$axios.delete(`post/${payload.postId}/like`, {
            withCredentials: true,
        })
        .then((res) => {
            commit('unlikePost', {
                userId: res.data.userId,
                postId: payload.postId,
            });
        })
        .catch((err) => {
            console.error(err);
        })
    },
}