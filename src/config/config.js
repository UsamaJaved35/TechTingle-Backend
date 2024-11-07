const config={
    production :{
        SECRET: process.env.PRODUCTION_SECRET,
        DATABASE: process.env.PRODUCTION_MONGODB_URI
    },
    default : {
        SECRET: process.env.DEFAULT_SECRET,
        DATABASE: process.env.DEFAULT_MONGODB_URI
    }
}


module.exports.get = function get(env){
    console.log(env);
    return config[env] || config.default
}