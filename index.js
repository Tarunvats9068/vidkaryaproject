const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const ejs = require('ejs');
const db = require('./config/mongoose');
const Admin = require('./models/Admin');
app.use(express.urlencoded());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(__dirname));
const passport = require('passport');
const Localpassport = require('./config/passport-local');
const session = require('express-session');
app.use(session({
    name : 'vidkarya',
    secret: 'Admin',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge: (1000*60*100)
    }
}
));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);



app.get('/admin/login',function(req,res)
{
    res.sendFile(path.join(__dirname,'login.html'));
    return ;
})
app.post('/admin/panel',passport.authenticate('local',{failureRedirect:'/admin/login'}),function(req,res)
{ 
                Admin.find({},function(err,Data){
                    console.log(Data);
                    if(err)
                    {
                        console.log('error in finding the databases');
                        return ;
                    }
                   return   res.render('admin.ejs',{
                        Admins:Data
                    });
                })
})
app.get('/admin/panel',passport.checkAuthentication,function(req,res)
{
    Admin.find({},function(err,Data){
        // console.log(Data);
        if(err)
        {
            console.log('error in finding the databases');
            return ;
        }
        return res.render('admin.ejs',{
            Admins:Data
        });
    });
})
app.post('/admin/signup',passport.checkAuthentication,function(req,res)
{
    console.log(req.body);
    Admin.create({email:req.body.email,
        password:req.body.psw
    },function(err,db){
        if(err){ console.log('error in creating the databases',err); return;}
        console.log(db);
        res.redirect('/admin/panel');
        return ;
    })
}
)
app.get('/admin/delete',function(req,res)

{
    let id = req.query.id;
    Admin.findByIdAndDelete(id,function(err)
    {
        if(err){console.log('error in deleting the admin'); return}
        return res.redirect('/admin/panel');
    })
}
)
app.get('/admin/signout',function(req,res){
    req.logout();
    return res.redirect('/admin/login');
})
app.listen(port,function(err)
{
    if(err)
    {
        console.log('error in running the server');
        return ;
    }
    console.log('server is up and running on port:',port);
    return ;
})
