const express = require('express')
const cors = require('cors');

const { dbConnection } = require('../database/config');
const { migration } = require('../database/migration');

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT;
        
        this.paths = {
            users: '/api/users',
            auth: '/api/auth',
            areas: '/api/areas',
            spaces: '/api/spaces',
            categories: '/api/categories',
            objects: '/api/objects',
        }

        // Conectar a base de datos
        this.connectDB();

        // MiddleWares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();

        // Ejecutar migracion de DB
        // this.migrate();
    }
    
    async migrate() {
        await migration();
    }
    
    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // Cors
        this.app.use(cors());
        
        // Lectura y parseo del body
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.paths.users, require('../routes/users_route'));
        this.app.use(this.paths.auth, require('../routes/auth_route'));
        this.app.use(this.paths.areas, require('../routes/areas_route'));
        this.app.use(this.paths.spaces, require('../routes/spaces_route'));
        this.app.use(this.paths.categories, require('../routes/categories_route'));
        this.app.use(this.paths.objects, require('../routes/objects_route'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port)
        }) ;
    }

}

module.exports = Server;