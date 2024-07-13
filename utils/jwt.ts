import jwt from "jsonwebtoken";
import config from "config";

export default {
  encode(data: Object) {
    return jwt.sign(data, config.get("jwtPrivateKey"))
  },
  verify(token: string): Object {
    const payload = jwt.verify(token, config.get("jwtPrivateKey")) as string;
    return JSON.parse(payload) || {};
  }
};
