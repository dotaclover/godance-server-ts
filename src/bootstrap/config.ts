import * as fs from 'fs';
[__dirname + "/../config", __dirname + "/../../config"].some((configDir) => {
    if (fs.existsSync(configDir)) {
        process.env["NODE_CONFIG_DIR"] = configDir;
        return true;
    }
});

import config from 'config';
export default config;