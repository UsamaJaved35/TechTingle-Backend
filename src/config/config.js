const config={
    production :{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default : {
        SECRET: 'mysecretkey',
        DATABASE: 'mongodb+srv://usamamughal4949:oq8okjo6k8c0eoHF@testnodejs.y2m32.mongodb.net/tech_tingle'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}