function getConfig() {
    if (process.env.API === 'production') {
        return {
            API_ROOT: '',
            PUBLIC_PATH: '',
            TOKEN: '123'
        }
    }

    return {
        API_ROOT: 'http://localhost:1337',
        PUBLIC_PATH: 'http://localhost:1337/',
        TOKEN: '123'
    }
}

exports.CONFIG = Object.assign(getConfig())
