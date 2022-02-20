<template>
    <v-container v-if="post">
        <PostCard :post="post" />
    </v-container>
    <div v-else>
        해당 아이디의 게시글이 존재하지 않습니다.
    </div>
</template>

<script>
import PostCard from '~/components/PostCard'

export default {
    components: {
        PostCard,
    },
    computed: {
        post() {
            // 파일에 언더스코어는 넉스트가 동적 라우트로 인식 
            // 언더스코 아이디는 $route.params에 저장 ( 키 이름은 파일 이름따라 바뀜 )
            // post/_id.vue 로 생성하면 /post url로 바로 접근 가능
            // post/_id/index.vue 로 생성하면 /post/{id}로 접근 해야함
            return this.$store.state.posts.mainPosts.find(v => v.id === parseInt(this.$route.params.id, 10))
        }
    }
}
</script>

<style>

</style>