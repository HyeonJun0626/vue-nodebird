module.exports = {
    head: {
        title: 'NodeBird'
    },
    modules: [
        '@nuxtjs/axios',
    ],
    buildModules: [
        '@nuxtjs/vuetify',
    ],
    vuetify: {
        
    },
    axios: {
        browserBaseURL: 'http://localhost:3085',
        baseURL: 'http://localhost:3085',
        https: false,
    },
    server: {
        port: process.env.PORT || 3080,
    },
    // webpack: (config, { isServer }) => {
    //     // Fixes npm packages that depend on `fs` module
    //     if (!isServer) {
    //         config.node = {
    //             fs: 'empty'
    //         }
    //     }
    //     return config
    // },
}