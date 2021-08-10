/**
 * JWTs provide a nice system for issuing and validating authentication tokens.
 * The authentication token will ensure that the client doesn’t need to log in every time
 * they want to perform an operation on the server
 * @argument-1: object to embed in token. This needs to include a unique identifier for the user
 * @argument-2: secrete phase. This is used to issue and validate token, ensuring that the token data hasn't been tampered
 * @argument-3: set of options. Below is one the option to create a token that valid for 7 days
 * Tokens can be issued to users when they sign up or log in to the application. These can
then be stored on the data and used to authenticate the user when they perform other
options.
 */

const jwt = require('jsonwebtoken');

const myFunction = async () => {
    //generate a token
    const token = jwt.sign({_id: 'abc123'}, 'mynodecourse', {expiresIn: '7 days'});
    console.log(token);

    const data = jwt.verify(token, 'mynodecourse');
    console.log(data);
};

myFunction();
