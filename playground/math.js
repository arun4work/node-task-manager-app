const calculateTip = (total, tipPercent = 0.25) => total + total * tipPercent;

const farenheitToCelcius = (temp) => (temp - 32) * 1.8;

const celciusToFarenheit = (temp) => temp * 1.8 + 32;

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b);
        }, 2000);
    });
};

module.exports = {
    calculateTip,
    farenheitToCelcius,
    celciusToFarenheit,
    add,
};
