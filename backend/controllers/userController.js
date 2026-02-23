const User = require('../models/User');
const crypto = require('crypto');

// Handles new user registration with validation and password hashing
exports.registerUser = (req, res, next) => {
    const wantsJson = req.headers.accept && req.headers.accept.includes('application/json');
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;
    const birthDate = req.body.birth_date;
    const city = req.body.city;
    const gender = req.body.gender;
    const occupation = req.body.occupation;

    if (password !== confirmPassword) {
        if (wantsJson) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        return res.status(400).send('Passwords do not match');
    }

    // Business rule: must be 13+ years old
    if (birthDate) {
        const birthDateObj = new Date(birthDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (birthDateObj >= today) {
            if (wantsJson) {
                return res.status(400).json({ message: 'Birth date cannot be in the future' });
            }
            return res.status(400).send('Birth date cannot be in the future');
        }

        const thirteenYearsAgo = new Date();
        thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
        if (birthDateObj > thirteenYearsAgo) {
            if (wantsJson) {
                return res.status(400).json({ message: 'You must be at least 13 years old to register' });
            }
            return res.status(400).send('You must be at least 13 years old to register');
        }
    }

    User.findByUsername(username)
        .then(([rows]) => {
            if (rows.length > 0) {
                if (wantsJson) {
                    return res.status(400).json({ message: 'Username already exists' });
                }

                return res.status(400).send('Username already exists');
            }

            const newUser = new User(username, password, birthDate, city, gender, occupation);
            return newUser.save().then(() => {
                if (wantsJson) {
                    return res.status(200).json({ success: true, redirect: '/' });
                }

                res.redirect('/');
            });
        })
        .catch((err) => {
            console.error('DB Error:', err);
            if (wantsJson) {
                return res.status(500).json({ message: 'Error while creating user' });
            }

            res.status(500).send('Error while creating user');
        });
};

// Authenticates user and creates session
exports.loginUser = (req, res, next) => {
    const wantsJson = req.headers.accept && req.headers.accept.includes('application/json');
    const username = req.body.username;
    const password = req.body.password;

    User.findByUsername(username)
        .then(([rows]) => {
            if (rows.length === 0) {
                if (wantsJson) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }

                return res.status(401).send('Invalid username or password');
            }

            const user = rows[0];
            const hashedInputPassword = crypto.createHash('sha256').update(password).digest('hex');

            if (hashedInputPassword !== user.password) {
                if (wantsJson) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }

                return res.status(401).send('Invalid username or password');
            }

            if (!req.session) {
                if (wantsJson) {
                    return res.status(500).json({ message: 'Session is not configured' });
                }

                return res.status(500).send('Session is not configured');
            }

            req.session.isLoggedIn = true;
            req.session.username = user.username;

            req.session.save((err) => {
                if (err) {
                    console.log(err);
                    if (wantsJson) {
                        return res.status(500).json({ message: 'Error while saving session' });
                    }

                    return res.status(500).send('Error while saving session');
                }

                if (wantsJson) {
                    return res.status(200).json({ success: true, redirect: '/' });
                }

                res.redirect('/');
            });
        })
        .catch((err) => {
            console.log(err);
            if (wantsJson) {
                return res.status(500).json({ message: 'Error while logging in' });
            }

            res.status(500).send('Error while logging in');
        });
};

// Destroys user session and clears cookie
exports.logoutUser = (req, res, next) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error while logging out');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

exports.authStatus = (req, res, next) => {
    const isLoggedIn = !!(req.session && req.session.isLoggedIn);
    const username = isLoggedIn ? req.session.username : null;

    if (!isLoggedIn) {
        return res.status(200).json({
            isLoggedIn,
            username
        });
    }

    User.getPublicByUsername(username)
        .then(([rows]) => {
            const user = rows[0] || null;
            res.status(200).json({
                isLoggedIn,
                username,
                user
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(200).json({
                isLoggedIn,
                username,
                user: null
            });
        });
};

