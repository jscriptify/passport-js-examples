const LocalStrategy = require('passport-local').Strategy;

const exampleUsers = [{
    id: 1,
    username: 'umutcakir',
    password: 'salt:test',
    salt: "salt"
}];

const validPassword = function (password, salt, hash) {
    const hashCompare = salt + ':' + password; // Bu sadece örnek. crypto gibi kütüphaneler kullanılabilir.
    return hashCompare === hash;
}

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        const user = exampleUsers.find(function (u) { return u.id === id });
        done(null, user);
        // req.user hazır!
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function (username, password, done) {
            const user = exampleUsers.find(function (u) { return u.username === username });
            if (user) {
                if (!validPassword(password, user.salt, user.password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect username.' });
            }
        }
    ));
}
