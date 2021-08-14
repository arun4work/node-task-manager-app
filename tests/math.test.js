const {calculateTip, celciusToFarenheit, farenheitToCelcius, add} = require('../playground/math');

test('Should calculate the total with tip', () => {
    const total = calculateTip(10, 0.3);
    expect(total).toBe(13);
});

test('Should convert 32 F to 0 C', () => {
    const temp = farenheitToCelcius(32);
    expect(temp).toBe(0);
});

test('Should convert 0 C to 32 F', () => {
    const temp = celciusToFarenheit(0);
    expect(temp).toBe(32);
});

test('Async test demo', (done) => {
    setTimeout(() => {
        expect(2).toBe(2);
        done();
    }, 2000);
});

test('Should add two numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done();
    });
});

test('Should add two numbers with async-await', async () => {
    const sum = await add(2, 3);
    expect(sum).toBe(5);
});
