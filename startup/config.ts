import config from 'config';
if (!config.get('jwt.privateKey')) {
    throw new Error('Fatal Error: jwt.privateKey is not defined.');
}


export default config;