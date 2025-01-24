import express from 'express'
import {statRouter} from "./routes/statistiqueRouter";
import logger from 'morgan';
import flash from 'express-flash-plus';

class App {

    public expressApp: express.Application

    constructor() {
        this.expressApp = express()

        // this.middleware() //  For middleware implementation
        this.middleware();
        this.routes() // For routes implementation

        // Pug Engine
        this.expressApp.set('view engine', 'pug') 

        // Static files
        this.expressApp.use(
            express.static(__dirname + '/public') as express.RequestHandler
        );
    }

    private middleware(): void {
        this.expressApp.use(logger('dev') as express.RequestHandler);
        this.expressApp.use(express.json() as express.RequestHandler);
        this.expressApp.use(express.urlencoded({ extended: false }) as express.RequestHandler);
        this.expressApp.use(flash());
    }


    private routes(): void {
        const router = express.Router()

        // Home Page
        router.get('/', (req, res) => {
            res.render(
                'index', 
                { title: 'Home' }
            )
        });

        router.get('/statistique', async (req, res) => {
            let compteurData = await statRouter.controllerStats.getStatData()
            res.render('statistique', {
                title: 'Statistique',
                listCompteurs: compteurData
            });
        })

        // Team Page
        router.get('/equipe', (req, res) => {
            res.render('equipe', {
                title: 'Equipe 11',
            })
        })

        router.get('/a-propos', async (req, res) => {
            res.render('project', {
                title: 'Le Projet - Mobilité Urbaine',
            })
        })

        this.expressApp.use('/', router);
        this.expressApp.use('/statistique', statRouter.router); // Pour tout autre operations avec la page statistique
    }

}

export default new App().expressApp

