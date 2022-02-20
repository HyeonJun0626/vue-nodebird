<template>
    <v-container>
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
        return store.dispatch('posts/loadPosts')
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