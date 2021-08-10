const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Task = require('./task');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: Number,
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid');
                }
            },
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            trim: true,
            validate(value) {
                if (validator.contains('password', value, {ignoreCase: true})) {
                    throw new Error("Password can't contain the word password");
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        avatar: {
            type: Buffer,
        },
    },
    {timestamps: true}
);

//create relationship between User and Task collection
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
});

//reusable function registered for user schema. This can be called with User Model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};

/** generateAuthToken can be called when user signin and signup
 * function registered for user document to be called to generate JWT token.
 * This can be called with user document but not Model
 */
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '7 days'});
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

/** Hide private data (password, token etc.) while fetching user details
 * when res.send() is called, express internally calls JSON.stringify.
 * Before JSON.stringify is called, toJSON() is called internally by express.
 * So removing private data from user before sending back to client
 */

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

//register a middleware to execute before save lifecycle event so that it can hash the password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

//register a middleware to execute before remove lifecycle event so that it can remove logged-in user's all tasks
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
});

//create an User model schema
const User = mongoose.model('User', userSchema);

module.exports = User;
