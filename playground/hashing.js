const bcrypt = require('bcrypt');

const hassPassword = async () => {
    const pass = 'Node123';
    const hashedPass = await bcrypt.hash(pass, 8);
    console.log(hashedPass);
    const isMatch = await bcrypt.compare('Node123', hashedPass);
    if (isMatch) console.log('isMatch ::' + isMatch);
};
hassPassword();
