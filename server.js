const express = require('express');
const sql = require('mysql2');
const bp = require('body-parser');
var session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app = express();
const path = require('path');
const { Console } = require('console');

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(express.static('images'));
app.use(express.static('scripts'));
app.use(express.static('styles'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}));

const db = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spmp',
    port: '3306'
});

db.connect((err) => {
    if (err) {
        console.log('Db connection error', err);
    }
});


app.listen(3100, () => {
    console.log("Server listening to port 3100!!!!")
})

app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/index.html`);
})

app.get('/userLogin', (req, res)=>{
    res.sendFile(`${__dirname}/login.html`);
})

