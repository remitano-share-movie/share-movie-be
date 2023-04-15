const jwt  = require('jsonwebtoken');

module.exports = class JwtService {

    static STATUS_VALID = 0;
    static STATUS_INVALID = 1;
    static STATUS_EXPIRED = 2;

    generateJwt(obj){
        const payload = JSON.stringify({
            id: obj._id,
            username: obj.username
        });

        return jwt.sign({
            data: payload
          }, process.env.JWT_SIGNING_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN});
    }

    verifyJwt(token){
        let result;

        try {
            result = jwt.verify(token, process.env.JWT_SIGNING_KEY);
        
            return JSON.parse(result.data)

        } catch (err) {
            return null
        }

    }
}