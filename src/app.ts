import express from 'express'


class App {

    public expressApp: express.Application

    constructor() {
        this.expressApp = express()

        // this.middleware() //  For middleware implementation

        this.routes() // For routes implementation

        // Pug Engine
        this.expressApp.set('view engine', 'pug') 

        // Static files
        this.expressApp.use(
            express.static(__dirname + '/public') as express.RequestHandler
        );
    }


    private routes(): void {
        const router = express.Router()

        router.get('/', (req, res) => {
            res.render(
                'index', 
                { title: 'Home' }
            )
        })

        this.expressApp.use('/', router)
    }
}

export default new App().expressApp

