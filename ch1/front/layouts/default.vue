<template>
    <v-app>
        <nav>
            <v-toolbar dark color="green">
                <v-toolbar-title>
                    <nuxt-link text to="/" :style="{ color: '#ffff', textdecoration: 'none' }">NodeBird</nuxt-link>
                </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-form @submit.prevent="onSearchHashtag">
                    <div :style="{ display : 'flex', height: '100%', alignItems: 'center' }">
                        <!-- hide-details : v-text-field 밑에 생기는 공백 메세지 있을때만 표시하게  -->
                        <v-text-field 
                            v-model="hashtag"
                            label="검색" 
                            hide-details 
                            prepend-icon="mdi-magnify" 
                        />
                    </div>
                </v-form>
                <v-btn text nuxt to="/profile" :style="{ display : 'flex', alignItems: 'center' }">
                    <div>프로필</div>
                </v-btn>
                <v-btn text nuxt to="signup" :style="{ display : 'flex', alignItems: 'center' }">
                    <div>회원가입</div>
                </v-btn>
            </v-toolbar-items>
            </v-toolbar>
        </nav>
        <v-container>
        <!-- no-gutters : v-row에 margin 초기화 -->
        <v-row no-gutters>
            <v-col cols="12" md="4">
                <login-form></login-form>
            </v-col>
            <v-col cols="12" md="8">
                <Nuxt />
            </v-col>
        </v-row>
        </v-container>
    </v-app>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'
export default {
    components: { 
        LoginForm 
    },
    data() {
        return {
            hashtag: '',
        }
    },
    methods: {
        onSearchHashtag() {
            this.$router.push({path: `/hashtag/${this.hashtag}`})
            this.hashtag = ''
        }
    },

}
</script>

<style scoped>
    a {
        display: inline-block;
        text-decoration: none;
        color: inherit;
    }
</style>