class Env {

    constructor(env=null) {
        if (env) {
            this.env = env
        } else if(process.env.NODE_ENV) {
            this.env = process.env.NODE_ENV
        } else {
            this.env = 'dev'
        }
    }

    get() {
        return this.env;
    }

    is (env) {
        return this.env === env;
    }
}

module.exports = new Env();