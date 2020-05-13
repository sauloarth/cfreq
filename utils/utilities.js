exports.randomNumber = length => {
    let text = '';
    const possible = '123456789';

    for (let i = 0; i < length; i++) {
        const top = Math.floor(Math.random() * possible.length);
        text += i > 0 && top == i ? '0' : possible.charAt(top)
    }

    return Number(text);
}