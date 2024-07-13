import config from 'config';
if (!config.get('jwtPrivateKey')) {
    throw new Error('Fatal Error: jwtPrivateKey is not defined.');
}