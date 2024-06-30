const getToken = (): string => {
    const ENV_JWT_SECRET = process.env.JWT_SECRET; // Replace with your actual secret key

    if(!ENV_JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    return ENV_JWT_SECRET;
}


export default getToken;