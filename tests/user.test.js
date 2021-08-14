const request = require('supertest');
const User = require('../src/models/user');
const app = require('../src/app');
const {userOne, userOneId, setupDatabase} = require('./fixtures/db');

/** beforeEach is called before each test case is run,
 * setupDatabase is wiping out the DB and inserting few dummy
 * user and task documents to User and Task collection
 */
beforeEach(() => {
    return setupDatabase();
});

test('Should sign up a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'AB Kumaravel',
            email: 'kumaravel@gmail.com',
            age: 38,
            password: 'node123',
        })
        .expect(201);

    //Assert that the database was changed properly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assert aboout the response
    expect(response.body).toMatchObject({
        user: {
            name: 'AB Kumaravel',
            email: 'kumaravel@gmail.com',
        },
    });
});

test('Should login an existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);

    //assert that new token is save in db
    const user = await User.findById(response.body.user._id);
    expect(user.tokens[1].token).toBe(response.body.token);
});

test('Should not login nonexistent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'wrongPass',
        })
        .expect(400);
});

/** This test case need to be authenticated.
 * 1. Creating JWT token for userOne so that token will saved before this test case is run
 * 2. Setting Auth token in request header so that the request can be authenticated
 */
test('Should get profile for login user', async () => {
    await request(app).get('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me').set('Authorization', `Bearer somestring`).send().expect(401);
});

test('Should delete profile for authenticated user', async () => {
    await request(app).delete('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200);

    //Assertion for user deleted successfully
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete profile for unauthenticated user', async () => {
    await request(app).delete('/users/me').set('Authorization', 'some string').send().expect(401);
});

/**This test case is to confirm image upload
 * created a folder fixtures inside tests folder and placed one image called me.JPG
 * supertest can attach that local image and upload, expected 2 parameters
 * @param1: in which name, your node program expecting to read
 * @param2: path of the local image with image name
 */
test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar').set('Authorization', `Bearer ${userOne.tokens[0].token}`).attach('avatar', 'tests/fixtures/me.JPG').expect(200);

    //Assertions of avatar update in db
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Akash',
            email: 'akash@gmail.com',
        })
        .expect(200);
    //Assertion about the actual change in db
    const user = await User.findById(userOneId);
    expect({name: user.name, email: user.email}).toEqual({
        name: 'Akash',
        email: 'akash@gmail.com',
    });
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            phone: 851776666,
        })
        .expect(400);
});

/** Other user api test ideas
 * Should not signup user with invalid name/email/password
 * should not update user if unauthenticated
 * Should not update user with invalid name/email/password
 * Should not delete an user if unathenticated
 *
 */
