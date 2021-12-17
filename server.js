//Initialization
const express = require('express');
const sql = require('mysql2');
const bp = require('body-parser');
var session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app = express();
const path = require('path');
const { Console } = require('console');

//app uses
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

//database configuration
const db = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tce_navigator',
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

//get funtions
app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/index.html`);
})

app.get('/userLogin', (req, res)=>{
    res.sendFile(`${__dirname}/login.html`);
})

app.get('/addevents', (req, res)=>{
    if(req.session.loggedin = true)
    {
        res.sendFile(`${__dirname}/addevents.html`);
    }
    else
    {
        res.sendFile(`${__dirname}/login.html`);
    }
    
})

app.get('/register', (req, res)=>{
    res.sendFile(`${__dirname}/register.html`)
})

app.get('/alert', (req, res)=>{
    res.sendFile(`${__dirname}/alert.html`);
})
//post functions
app.post('/user', (req, res)=>{
    req.session.loggedin = false;
    var email = req.body.email;
    console.log(email)
    
    var password = req.body.password;
    console.log(password)

    if (email && password) {
        db.query(`SELECT * FROM user WHERE mail = '${email}' `, function(error, results) {
            if(error) throw error;
            if (results.length > 0) {
                var hash = results[0].password;

                const passwordHash = bcrypt.hashSync(password, 10);
                console.log(passwordHash)
                const verified = bcrypt.compareSync(password, hash);

                if (verified) {
                    req.session.loggedin = true;
                    req.session.email = email;
                    req.session.name = results[0].name;
                    res.redirect('/addevents');
                } else {
                    res.write(`<script>window.alert('Enter the correct password!!!!!');window.location.href = '/userLogin';</script>`);
                }

            } else {

                res.write(`<script>window.alert('Enter the correct email!!!!!');window.location.href = '/userLogin';</script>`)
            }
            res.end();
        });
    } else {
        res.write(`<script>window.alert('Enter  password and email!!!!!!');window.location.href = '/userLogin';</script>`)
    }
})

app.post('/register', (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password1 = req.body.password1;
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(password1)
    if(password == password1)
    {
        console.log("if entered")
        const passwordHash = bcrypt.hashSync(password, 10);
        let qr = `INSERT INTO user(name, mail, password) VALUES('${name}', '${email}', '${passwordHash}')`
        db.query(qr, (error, result)=>{
            if(error) throw error;
            res.write(`<script>window.alert('Registration successful');window.location.href = '/userLogin';</script>`)
        })
    }
    else
    {
        res.redirect('/alert');
    }
})
