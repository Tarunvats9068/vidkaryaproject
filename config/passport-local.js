const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/Admin');
passport.use(new LocalStrategy({
    usernameField: 'email'
}, function (email, password, done) {
    Admin.findOne({ email: email }, function (err, user) {
        if (err) { console.log('error in finding the user in passport'); return; }
        if (!user || user.password != password) {
            return done(null, false);
        }
        return done(null, user);
    }
    );

}
));
passport.serializeUser(function(user, done){
    console.log(user);
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, user) {
        if (err) {
            console.log('error in finding the user in deserialize');
        }
        return done(null, user);
    }

    );
});
passport.checkAuthentication =function(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    return res.redirect('/admin/login');
}
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated())
    {
        res.locals.user = req.user;
    }
     return next();
}
module.exports = passport;