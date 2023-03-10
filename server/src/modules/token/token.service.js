import jwt from 'jsonwebtoken';
import { TOKEN_TYPES } from '../../constants.js';

class TokenService {
  generateTokens({ id, email, isActivated }) {
    const {
      JWT_SECRET_KEY, JWT_SECRET_REFRESH_KEY, TOKEN_EXPIRE_TIME, TOKEN_REFRESH_EXPIRE_TIME,
    } = process.env;
    const payload = { id, email, isActivated };
    const accessToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRE_TIME });
    const refreshToken = jwt.sign(
      payload,
      JWT_SECRET_REFRESH_KEY,
      { expiresIn: TOKEN_REFRESH_EXPIRE_TIME },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  validateToken(token, type = TOKEN_TYPES.ACCESS) {
    const { JWT_SECRET_KEY, JWT_SECRET_REFRESH_KEY } = process.env;
    const secret = type === TOKEN_TYPES.ACCESS ? JWT_SECRET_KEY : JWT_SECRET_REFRESH_KEY;

    try {
      const data = jwt.verify(token, secret);
      return data;
    } catch (error) {
      return null;
    }
  }

  validateAccessToken(token) {
    return this.validateToken(token);
  }

  validateRefreshToken(token) {
    return this.validateToken(token, TOKEN_TYPES.REFRESH);
  }
}

export default new TokenService();
