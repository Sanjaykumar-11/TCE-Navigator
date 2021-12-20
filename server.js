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
const nodemailer = require('nodemailer')

//app uses
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(express.static('images'));
app.use(express.static('scripts'));
app.use(express.static('styles'));
app.use(express.static('upload'));
app.use(express.static('imgg'));

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

app.get('/unsubscribe', (req, res)=>{
    res.sendFile(`${__dirname}/login.html`);
})

app.get('/gallery', (req, res)=>{
    res.sendFile(`${__dirname}/gallery.html`);
})

app.get('/adminLogin', (req, res)=>{
    res.sendFile(`${__dirname}/adminlogin.html`)
})

app.get('/dashboardtotal', (req, res)=>{
    let q = `SELECT COUNT(id) FROM event`
    db.query(q, (error, result)=>{
        if(error) throw error;
        console.log(result)
        //var x = result[0]['COUNT(id)']
        res.send(result)
    })
})

app.get('/dashboardparticular', (req, res)=>{
    let qr = `SELECT COUNT(id) FROM event WHERE display='yes'`
    db.query(qr, (err, result)=>{
        if(err) throw error;
        //var y = result[0]['COUNT(id)'];
        res.send(result)
    })
})

app.get('/dashboard', (req, res)=>{
    let q = `SELECT * FROM event WHERE display='yes'`
    db.query(q, (error, result)=>{
        res.send(result)
    })
})
app.get('/subscribe', (req, res)=>{
    res.sendFile(`${__dirname}/register.html`)
})

app.get('/alert', (req, res)=>{
    res.sendFile(`${__dirname}/alert.html`);
})

app.get('/fullscreenmap', (req, res)=>{
    res.sendFile(`${__dirname}/fullscreenmap.html`);
})

app.get('/addevents', (req, res)=>{
    if(req.session.loggedin == true)
    {
        console.log(req.session.loggedin)
        res.sendFile(`${__dirname}/addevents.html`);
    }
    else
    {
        res.redirect(`adminLogin`)
    }
});

app.get('/editevents', (req, res)=>{
    if(req.session.loggedin == true)
    {
        console.log(req.session.loggedin)
        res.sendFile(`${__dirname}/editevents.html`)
    }
    else
    {
        res.redirect(`adminLogin`)
    }
})

app.get('/eventtable', (req, res)=>{
    let q = `SELECT * FROM event`
    db.query(q, (err, results)=>{
        if(err) throw err;
        res.send(results);
    })
})

app.get('/logout', (req, res)=>{
    req.session.loggedin = false;
    res.redirect(`/`)
})

app.get('/updateform', (req, res)=>{
    req.session.up_id = req.query.id;
    res.sendFile(`${__dirname}/updateevents.html`);
})

app.get('/update', (req, res)=>{
    if(req.session.up_id != undefined)
    {
        if(req.session.up_id != "")
        {
            console.log(req.session.up_id)
            let q = `SELECT * FROM event WHERE id=${req.session.up_id}`;
            db.query(q, (error, result)=>{
            if(error) throw error;
            res.send(result);
            });
        }
        else
        {
            res.send()
        }
    }
    else
    {
        res.send()
    }
})

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
        if(id != "")
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
    }
    else
    {
        res.send();
    }
})
//post functions
app.post('/user', (req, res)=>{
    var email = req.body.email;
    console.log(email)
    
    var password = req.body.password;
    console.log(password)

    if (email && password) {
        var msg = `<p>Sir/Madam,<br>You successfully <b color="red">unsubscribed</b> from TCE NAVIGATOR. You will no longer receive emails.<br><br>Thank you.<br><br>Regards,<br>TCE NAVIGATOR ADMIN.`
        db.query(`DELETE FROM user WHERE mail = '${email}'`, function(error, results) {
            if(error) throw error;
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth:{
                    user: "apiprojectportal@gmail.com",
                    pass: "tceit123"
                },
                tls:{
                    rejectUnauthorized: false
                }
            });
            let mailoptions = {
                from: '"ADMIN" <apiprojectportal@gmail.com>',
                to: `${email}`,
                subject: "TCE NAVIGATOR - SUBSCRIPTION",
                html: msg,
            }
            transporter.sendMail(mailoptions, (err, info)=>{
                if(err)
                    throw err;
                console.log("Message sent");
                res.write(`<script>window.alert('UNSUBSCRIBED SUCCESSFULLY!!!!');window.location.href = '/';</script>`)
            })
        });
    } 
})

app.post('/register', (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password1 = req.body.password1;

    q = `SELECT mail FROM user WHERE mail='${email}'`
    db.query(q, (error, result)=>
    {
        if(error) throw error;
        if(result.length === 0)
        {
            if(password == password1)
            {
                const passwordHash = bcrypt.hashSync(password, 10);
                var msg = `<p>Sir/Madam,<br>This is the notification about the <b>successful subscription</b> on TCE NAVIGATOR. <br><br>Thank you.<br><br>Regards,<br>TCE NAVIGATOR ADMIN.`
                let qr = `INSERT INTO user(name, mail, password) VALUES('${name}', '${email}', '${passwordHash}')`
                db.query(qr, (error, result)=>{
                    if(error) throw error;
                    let transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth:{
                            user: "apiprojectportal@gmail.com",
                            pass: "tceit123"
                        },
                        tls:{
                            rejectUnauthorized: false
                        }
                    });
                    let mailoptions = {
                        from: '"ADMIN" <apiprojectportal@gmail.com>',
                        to: `${email}`,
                        subject: "TCE NAVIGATOR - SUBSCRIPTION",
                        html: msg,
                    }
                    transporter.sendMail(mailoptions, (err, info)=>{
                        if(err)
                            throw err;
                        console.log("Message sent");
                        res.write(`<script>window.alert('Subcription successful');window.location.href = '/';</script>`)
                    })
                })
            }
            else
            {
                res.redirect('/alert');
            }
        }
        else
        {
            res.write(`<script>window.alert('User already exist!'); window.location.href = '/';</script>`)
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
    var event_desc = req.body.event_desc

    var q = `INSERT INTO event(date, event_name, event_venue, registration_venue, description) VALUES('${event_date}','${event_name}','${event_venue}','${registration_venue}', '${event_desc}');`
    db.query(q, (err, result)=>{
        if(err) throw err;
        req.session.eventid = result['insertId'];
        console.log(req.session.eventid)
        let qr = `SELECT mail from user`
        var msg = `<p>Sir/Madam,<br>This is the notification about the event. <br>EVENT NAME: ${event_name}<br>EVENT DATE: ${event_date}<br>EVENT VENUE: ${event_venue}<br>REGISTRATION VENUE: ${registration_venue}<br>EVENT DESCRIPTION: ${event_desc}<BR><br>Thank you<br><br>Regards,<br>TCE NAVIGATOR ADMIN`
        db.query(qr, (error, result)=>{
            for(var i=0; i<result.length; i++)
            {
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth:{
                        user: "apiprojectportal@gmail.com",
                        pass: "tceit123"
                    },
                    tls:{
                        rejectUnauthorized: false
                    }
                });
                let mailoptions = {
                    from: '"ADMIN" <apiprojectportal@gmail.com>',
                    to: `${result[i]['mail']}`,
                    subject: "TCE NAVIGATOR - SUBSCRIPTION",
                    html: msg,
                }
                transporter.sendMail(mailoptions, (err, info)=>{
                    if(err)
                        throw err;
                    console.log("Message sent");
                    res.redirect('/uploadfile');
                })
            }
        })
    })
});
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'upload')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now()

        var file = uniqueSuffix + path.extname(file.originalname)

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

app.post('/upevent',(req, res)=>{
    var id = req.body.event_id
    var event_name = req.body.event_name
    var event_date = req.body.event_date
    var event_venue = req.body.event_venue
    var registration_venue = req.body.registration_venue
    var event_desc = req.body.event_desc
    var publish = req.body.publish;
    let q=`UPDATE event SET date='${event_date}', event_name='${event_name}', event_venue='${event_venue}',registration_venue='${registration_venue}', description = '${event_desc}', display = '${publish}' where id ='${id}'`;
    db.query(q,(err,result)=>{
        if(err) throw err;
        res.write(`<script>window.alert('Updated!'); window.location.href = 'editevents';</script>`);
    })
})

app.post('/delev',(req,res)=>{
    var id=req.body.devent;
    let q=`DELETE FROM event where id='${id}'`
    db.query(q,(err,result)=>{
        if( err) throw err;
        res.redirect('editevents')
    })})
