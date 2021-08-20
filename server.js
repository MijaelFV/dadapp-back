const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path')

const { dbConnection } = require('./database/config');
const { migration } = require('./database/migration');
const { readDir } = require('./helpers/handle-files');

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT;
        
        // Conectar a base de datos
        this.connectDB();

        // MiddleWares
        this.middlewares();

        // Rutas de mi aplicacion
        this.apiRoutes();

        // Ejecutar migracion de DB
        // this.migrate();
    }
    
    async migrate() {
        await migration();
    }
    
    async connectDB() {
        await dbConnection();
    }

    /*
    Carga rutas de express automaticamente 
    los archivos deben estar en la carpeta routes
    y deben finalizar con el nombre "_route" 
    */
    async apiRoutes() {
        const _route = '/api'
        const _path = path.join(__dirname,'routes');
        const _replace = '_route';
        // Recorre el directorio y retorna un array con { file, filename, name }
        let routes = await readDir(_path,_replace);
        routes.map(route=>{
            let apiPath = path.join(_route,route.name).replace(/[\\]/g, '/');
            let filePath = path.join(_path,route.filename);

            // Crea las rutas
            this.app.use(apiPath, require(filePath));

            console.log("[set_route]",apiPath,"->",filePath);
        })
    }

    middlewares() {
        // Cors
        this.app.use(cors());
        
        // Lectura y parseo del body
        this.app.use(express.json());

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port)
        }) ;
    }

}

module.exports = Server;