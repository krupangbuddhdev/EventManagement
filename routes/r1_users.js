const express = require('express');
const router = express.Router();
const Ruser = require("../models/r_users");
const multer = require("multer");
const fs = require("fs");
const nodemailer = require('nodemailer');

//image upload
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});
  
var upload = multer({
    storage: storage,
}).single("image");

router.post('/add', upload, (req, res) => {
    Ruser.findOne({email:req.body.email}, function(err, ruser){
        if(ruser){
            if(ruser.name == req.body.name || ruser.email == req.body.email){
                req.session.message = {
                    type: 'danger',
                    message: 'User is already registered!'
                };
                res.redirect('/registered_users');
            }
        }
        else {
            const ruser = new Ruser({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                ename: req.body.ename,
                image: req.file.filename,
            });
            ruser.save((err) => {
                if(err){
                    res.json({message: err.message, type: 'danger'});
                } else {
                    req.session.message = {
                        type: 'success',
                        message: 'User registered successfully!'
                    };
                    res.redirect('/registered_users');
                }
            })
            console.log('Data: ', req.body);

            var path = req.file.path
            console.log(path)
            const output = `<p>You have registered for the ${ req.body.ename } event</p>
                <h3>Event Details</h3>
                <ul>
                    <li>Name: ${req.body.name}</li>
                    <li>Email ID: ${req.body.email}</li>
                    <li>Mobile Number: ${req.body.phone}</li>
                    <li>Event name: ${req.body.ename}</li>
                </ul>
            `;
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: 'nhkbuddhdev@gmail.com', // generated ethereal user
                pass: 'ruzuxvuznpnqnjbs', // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // send mail with defined transport object
            let info = transporter.sendMail({
                from: '"Krupang Buddhdev" <nhkbuddhdev@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: output, // html body
                attachments: [
                    {
                        filename: req.file.filename,
                        path: path
                    }
                ]
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    })
});

router.get('/registered_users', (req, res) => {
    res.render("registered_users",{title: "Event Registration"});
});

router.get('/list1', (req, res) => {
    Ruser.find().exec((err, rusers) => {
       if(err) {
        res.json({message: err.message});
       } else {
        res.render("list1", {
            title: "Registered Users",
            rusers: rusers
        });
       }
    });
});

module.exports = router;