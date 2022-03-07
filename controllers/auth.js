const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


//get register
exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        path: '/register',
        pageTitle: 'Register',
        errorMessage: null
    });
}

//get register
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: null
    });
}

//register user
exports.postRegister = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/register', {
            path: '/register',
            pageTitle: 'Register',
            errorMessage: errors.array()[0].msg
        });
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt
        .hash(password, 12)
        .then(hashPw => {
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashPw
            });
            return user.save();
        })
        .then(result => {
            const token = jwt.sign(
                {
                    email: result.email,
                    userId: result._id.toString()
                },
                process.env.JWT_SECRETKEY,
                { expiresIn: '7200s' }
            );
            res.cookie("token", token, {
                maxAge: 7200*1000,
                httpOnly: true,
            });
            res.redirect('/');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

//login user
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User
        .findOne({email: email})
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found');
                return res.status(401).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: error.message
                });
            }

            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                return res.status(401).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: error.message
                });
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                process.env.JWT_SECRETKEY,
                { expiresIn: '7200s' }
            );
            res.cookie("token", token, {
                maxAge: 7200 * 1000
            });
            res.redirect('/');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

//logout user
exports.postLogout = (req, res, next) => {
    res.clearCookie("token");
    res.redirect('/');
};
