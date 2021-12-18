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

app.get('/adminLogin', (req, res)=>{
    res.sendFile(`${__dirname}/adminlogin.html`)
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

app.get('/addevents', (req, res)=>{
    res.sendFile(`${__dirname}/addevents.html`);
});

app.get('/userpage', (req, res)=>{
    res.sendFile(`${__dirname}/userpage.html`)
}) 

app.get('/uploadfile', (req, res)=>{
    res.sendFile(`${__dirname}/fileupload.html`)
})

app.get('/upf', (req, res)=>{
    var id = req.session.eventid
    var q = `SELECT * from event WHERE id=${id}`
    if(id != undefined)
    {
        db.query(q, (err, result)=>{
            if(err) throw err;
            res.send(result)
        })
    }
    else
    {
        res.send();
    }
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
                    res.redirect('/userpage');
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

    q = `SELECT mail FROM user WHERE mail='${email}'`
    db.query(q, (error, result)=>
    {
        if(error) throw error;
        if(result.length === 0)
        {
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
        }
        else
        {
            res.write(`<script>window.alert('User already exist!'); window.location.href = '/userLogin';</script>`)
        }
    });
})

app.post('/admin', (req, res)=>{
    req.session.loggedin = false;
    var email = req.body.email;
    console.log(email)
    
    var password = req.body.password;
    console.log(password)

    if (email && password) {
        db.query(`SELECT * FROM admin WHERE email = '${email}' `, function(error, results) {
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
                    res.write(`<script>window.alert('Enter the correct password!!!!!');window.location.href = '/adminLogin';</script>`);
                }

            } else {

                res.write(`<script>window.alert('Enter the correct email!!!!!');window.location.href = '/adminLogin';</script>`)
            }
            res.end();
        });
    } else {
        res.write(`<script>window.alert('Enter  password and email!!!!!!');window.location.href = '/adminLogin';</script>`)
    }
})
app.post('/eventform', function(req, res) {
    var event_name = req.body.event_name
    var event_date = req.body.event_date
    var event_venue = req.body.event_venue
    var registration_venue = req.body.registration_venue
    var location_link = req.body.location_link
    var event_desc = req.body.event_desc

    var q = `INSERT INTO event(date, event_name, event_venue, registration_venue, location_link, description) VALUES('${event_date}','${event_name}','${event_venue}','${registration_venue}','${location_link}','${event_desc}');`
    db.query(q, (err, result)=>{
        if(err) throw err;
        req.session.eventid = result['insertId'];
        res.redirect('/uploadfile');
    })
});
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'upload')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        var file = uniqueSuffix + '.' + path.extname(file.originalname)

        cb(null, file)
    }
}) 

var upload = multer({ storage: storage });

app.post('/upl', upload.single('filer'), function(req, res) {

    const file = req.file
    if (!file) {
        res.write(`<script>window.alert('Upload file');window.location.href = '/uploadfile';</script>`);
    }
    let q = `UPDATE event SET event_img = '${file.filename}' WHERE id=${req.session.eventid};`
    db.query(q, (err, result) => {
        if (err)
            throw (err)
        req.session.eventid = "";
        res.redirect(`addevents`);
    })
});