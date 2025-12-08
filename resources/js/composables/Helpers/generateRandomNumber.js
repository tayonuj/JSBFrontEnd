const generateRandomNumber = (length = 6) => {
    let randomNumber = 0;
    for (let i = 0; i < length; i++) {
        randomNumber += Math.floor(Math.random() * 10).toString();
    }

    return Number(randomNumber);

};

export { generateRandomNumber };
