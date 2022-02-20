<template>
    <v-container v-if="other">
        <v-card style="margin-bottom: 20px;">
            <v-container>
                {{other.nickname}}
                <v-row>
                    <v-col cols="4">{{other.Followings.length}} 팔로잉</v-col>
                    <v-col cols="4">{{other.Followers.length}} 팔로워</v-col>
                    <v-col cols="4">{{other.Posts.length}} 게시글</v-col>
                </v-row>
            </v-container>
        </v-card>
        <PostForm v-if="me" />
        <div>
            <PostCard v-for="p in mainPosts" :key="p.id" :post="p"/>
        </div>
    </v-container>
</template>

<script>
import PostCard from '~/components/PostCard';
export default {
    components: {
        PostCard,
    },
    data() {
        return {
            name: 'Nuxt.js'
        }
    },
    computed: {
        other() {
            return this.$store.state.users.other
        },
        mainPosts() {
            return this.$store.state.posts.mainPosts
        },
    },
    fetch({ store, params }) {
        store.dispatch('users/loadOther', {
            userId: params.id,
        });
        return store.dispatch('posts/loadUserPosts', {
            userId: params.id,
            reset: true,
        });
    },
    asyncData() { // fetch는 store에 데이터를 체울때, asyncData는 각 컴포넌트 data에 체울때 ?
        return {};
    },
    mounted() {
        window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
        onScroll() {
            // infinity scrolling 에 버츄얼라이즈드 리스트 vue-virtual-scroll-list 같이 써주면 좋음 (알아볼것)
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (this.hasMorePost) {
                    console.log('scroll')
                    this.$store.dispatch('posts/loadPosts')
                }
            }
        }
    },
}
</script>

<style>

</style>