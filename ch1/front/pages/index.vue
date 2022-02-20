<template>
    <v-container>
        <PostForm v-if="me" />
        <div>
            <PostCard v-for="p in mainPosts" :key="p.id" :post="p"/>
        </div>
    </v-container>
</template>

<script>
import PostCard from '~/components/PostCard';
import PostForm from '~/components/PostForm';
export default {
    components: {
        PostCard,
        PostForm,
    },
    data() {
        return {
            name: 'Nuxt.js'
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me
        },
        mainPosts() {
            return this.$store.state.posts.mainPosts
        },
        hasMorePost() {
            return this.$store.state.posts.hasMorePost
        }
    },
    fetch({ store }) {
        return store.dispatch('posts/loadPosts', {reset: true});
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