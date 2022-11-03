const express = require('express')
const app = express()
const port = 3000;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')


app.use(cors());
app.options('*', cors());


require('dotenv/config');
const api = process.env.API_URL;

//Routers
const productsRouter = require('./routers/productsR');
const usersRouter = require('./routers/usersR');
const categoriesRouter = require('./routers/categoriesR');
const ordersRouter = require('./routers/ordersR');
const authJwt = require('./security/jwt');
const errorCatch = require('./security/error');




//middleware
app.use(express.json());
// middleware bodyparser
app.use(bodyParser.urlencoded({
    extended: true
}));
// middleware morgane
app.use(morgan('dev'));
// middleware jwt 
app.use(authJwt())
// middleware for the errors
app.use(errorCatch)

// middleware des Routes
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);




mongoose.connect(process.env.DB_INF)
    .then(() => {
        console.log('Connection a la base de donne OK!!!');
    })
    .catch((err) => {
        console.log(err);
    })


app.get('/', (req, res) => res.send('server ok '))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))