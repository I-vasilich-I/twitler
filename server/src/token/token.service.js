import jwt from 'jsonwebtoken';

const accessSecretKey = process.env.JWT_SECRET_KEY;
const refreshSecretKey = process.env.JWT_SECRET_REFRESH_KEY;
const accessExpire = process.env.TOKEN_EXPIRE_TIME;
const refreshExpire = process.env.TOKEN_REFRESH_EXPIRE_TIME;

class TokenService {
  generateTokens({ id, email, isActivated }) {
    const payload = { id, email, isActivated }
    const accessToken = jwt.sign(payload, accessSecretKey, { expiresIn: accessExpire });
    const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: refreshExpire });

    return {
      accessToken,
      refreshToken
    }
  }

  validateToken(token, type = 'access') {
    const secret = type === 'access' ? accessSecretKey : refreshSecretKey;
    try {
      const data = jwt.verify(token, secret);
      return data;
    } catch (error) {
      return null
    }
  }

  validateAccessToken(token) {
    return this.validateToken(token);
  }

  validateRefreshToken(token) {
    return this.validateToken(token, 'refresh');
  }
}

export default new TokenService();