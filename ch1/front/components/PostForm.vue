<template>
    <v-card style="margin-bottom: 20px">
        <v-container>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea 
                    v-model="content"
                    outlined
                    auto-grow
                    clearable
                    label="어떤 신기한 일이 있었나요?"
                    :hide-details="hideDetails"
                    :success-message="successMessage"
                    :success="success"
                    :rules="[text => !!text.trim() || '내용을 입력하세요']"
                    @input="onChangeTextarea"
                />
            <v-btn type="submit" color="green" absolute right>짹짹</v-btn>
            <input ref="imageInput" type="file" multiple hidden @change="onChangeImages">
            <v-btn type="button" @click="onClickImageUpload()">이미지 업로드</v-btn>
            <div>
                <div v-for="(image, i) in imagePaths" :key="i" style="display: inline-block;">
                    <img :src="`http://localhost:3085/${image}`" alt="image" style="width: 200px">
                    <div>
                        <button @click="onRemoeImage(i)" type="button">제거</button>
                    </div>
                </div>
            </div>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
// import {createNamespacedHelpers} from 'vuex'

// const
//     userListHelper = createNamespacedHelpers('A/B/User'),
//     bookListHelper = createNamespacedHelpers('A/B/C/Book')
import {  mapState } from 'vuex'
export default {
    data() {
        return {
            valid: false,
            hideDetails: true, // textarea 밑에 에러메세지 공백 생기는 것
            successMessage: '',
            success: false,
            content: '',
        }
    },
    computed: {
        // ... userListHelper.mapState({
        //     userList: state => state.user.userList
        // }),
        // ... bookListHelper.mapState([
        //     'list'
        // ])
        ...mapState('users', ['me']),
        ...mapState('posts', ['imagePaths'])
    },
    mounted() {
    },
    methods: {
        // ...userMapActions({
        //     setUserList: 'setUserList'
        // }),
        // ...bookMapActions([
        //     'setBookList'
        // ]),
        onChangeTextarea() {
            this.hideDetails = true;
            this.success = false;
            this.successMessages = '';
        },
        onSubmitForm() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('posts/add', {
                    content: this.content,
                })
                .then( () => {
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMessage = '게시글 등록 성공 ! ';
                })
                .catch( () => {

                })
            }
        },
        onClickImageUpload() {
            this.$refs.imageInput.click();
        },
        onChangeImages(e) {
            console.log(e.target.files);
            const imageFormData = new FormData();
            // [].forEach.call 을 쓰는 이유는 forEach를 강제로 적용하기 위해서
            // e.target.files가 console로 보면 배열이 아님 array like object 유사 배열임
            [].forEach.call(e.target.files, (f) => {
                imageFormData.append('image', f); // { image: [file1, file2] }
            });
            this.$store.dispatch('posts/uploadImages', imageFormData);
        },
        onRemoeImage(index) {
            this.$store.commit('posts/removeImagePaths', index);
        }
    }
}
</script>

<style>

</style>