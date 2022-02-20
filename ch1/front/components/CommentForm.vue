<template>
    <v-form ref="form" v-model="valid" style="position: relative" @submit.prevent="onSubmitForm">
        <v-textarea
            v-model="content"
            filed
            auto-grow
            label="댓글달기"
            :hide-details="hideDetails"
            :success="success"
            :success-message="successMessages"
            @input="onChangeTextarea"
        />
        <v-btn color="green" dark absolute top right type="submit">댓글작성</v-btn>
    </v-form>
</template>

<script>
export default {
    props: {
        postId: {

        },
        post: {
            type: Object
        }
    },
    data() {
        return { 
            valid: false,
            content: '',
            success: false,
            successMessages: '',
            hideDetails: true,
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me;
        }
    },
    methods: {
        onChangeTextarea(value) {
            if (value.length) {
                this.hideDetails = true;
                this.success = false;
                this.successMessages = '';
            }
        },
        onSubmitForm() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('posts/addComment', {
                    // id: Date.now(),
                    // user: {
                        //     nickname: this.me.nickname,
                    // }
                    postId: this.postId,
                    content: this.content,
                })
                .then( () => {
                    this.content = '';
                    this.success = true;
                    this.successMessages = '댓글이 작성되었습니다.';
                    this.hideDetails = false;
                })
                .catch( () => {

                })
            }
        }
    }
}
</script>

<style>

</style>