const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const {sendWelcomeMail, sendCancelationEmail} = require('../email/account');

const router = express.Router();

//Create new user router, used for Signup user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken(); //generate auth token with JWT and save to DB and send the token back to client
        sendWelcomeMail(user.email, user.name);
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});

/** Login an user by validating email and password
 * Approach-1: Fetch an user by email and then validate password by bcrypt hashing compare
 * Approach-2: Create a reusable function in user schema so that we can call that from anywhere in app to validate.
 * Approach-2 is better to proceed.
 */
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});

//logout an user
router.post('/users/logout', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send({error: e.message});
    }
});

//logout for all devices
router.post('/users/logoutAll', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send({error: e.message});
    }
});

//Get my profile
router.get('/users/me', authMiddleware, async (req, res) => {
    res.send(req.user);
});

//delete my profile
router.delete('/users/me', authMiddleware, async (req, res) => {
    try {
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});

//update my profile
router.patch('/users/me', authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidFieldtoUpdate = updates.every((key) => {
        return allowedUpdates.includes(key);
    });

    if (!isValidFieldtoUpdate) {
        return res.status(400).send({error: 'Invalid updates!'});
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});

// upload avatar using multer library
const upload = multer({
    // dest: 'avatars', // should be commented when you need to access image data in req parameter as req.file
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
            return cb(new Error('Please upload a file with valid extension'));
        }
        cb(undefined, true); //no error, multer accepts to upload
        //cb(undefined, false); //no error but multer silently rejects
    },
});
router.post(
    '/users/me/avatar',
    authMiddleware,
    upload.single('avatar'),
    async (req, res) => {
        req.user.avatar = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer();
        req.user.save();
        res.send();
    },
    // with these signature of addition parameter in router, express can understand this for error handling
    (err, req, res, next) => {
        res.status(400).send({error: err.message});
    }
);

//serving avatar image to client
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (err) {
        res.status(404).send({error: e.message});
    }
});

module.exports = router;
