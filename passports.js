const path = require('path')

module.exports = function(app, User,passport) {

app.post('/register', function (req, res) {
        console.log(req.body)
        User.register(
            new User({ 
                email: req.body.email, 
                username: req.body.username 
            }), req.body.password, function (err, msg) {
                if (err) {
                res.send(err);
                } else {
                res.sendFile(path.join(__dirname,'/public/login.html'));
                }
            }
        )
    })

    app.post('/login', passport.authenticate('local', { 
        failureRedirect: '/sign-in', 
        successRedirect: '/profile'
    }), (err, req, res, next) => {
        if (err) next(err);
    });

    app.get('/sign-in', (req, res, next) => {
        console.log('not authenticated');
        res.sendFile(path.join(__dirname,'/public/login.html'))
    });

    app.get('/login-success', (req, res, next) => {
        console.log(req.session);
        res.send('Login Attempt was successful.');
    });

    app.get('/profile', function(req, res) {
        console.log(req.body)
        if (req.isAuthenticated()) {
            res.render(('profile'), {user:req.session.passport.user})
        } else {
            res.render(('login'), {alert:false})
        }
    })

    app.post('/logout', function(req, res, next){
        req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
        });
    });
}