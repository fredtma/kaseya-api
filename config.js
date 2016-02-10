module.exports={
    defaults:{
        port:9999,
        appName: 'todo',
        loggly: {
            username: '',
            password: '',
            token: '',
            subdomain: ''
        }
    },
    dev: {
    },
    qa:{
        loggly: {
            username: 'encentivizeqa',
            password: '6s45AG500E',
            token: 'e9fba76d-3790-4ed0-973f-a3dc1a792755',
            subdomain: 'encentivizeqa'
        }
    },
    production:{
        loggly: {
            username: 'encentivize',
            password: '3nc3ntLggly',
            token: '06398176-189b-43ce-81b1-83c2b6449bba',
            subdomain: 'encentivize'
        }
    }
}
