import config from "config";
import jwt from "jsonwebtoken";

//
if (!config.get('jwt.privateKey'))
  throw new Error('Fatal Error: jwt.privateKey is not defined.');

class JwtUtil {
  public encode(data: Object) {
    return jwt.sign(data, config.get("jwt.privateKey"))
  }

  public verify(token: string, maxAge = 86400): Object {
    const payload = jwt.verify(token, config.get("jwt.privateKey"), {
      maxAge
    });
    return payload;
  }
};

const jwtUtil = new JwtUtil();
export default jwtUtil;