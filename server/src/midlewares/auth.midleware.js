import { UnauthorizedRequestException } from '../exceptions/index.js';
import tokenService from '../token/token.service.js';

export default function(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
  
    if(!authHeader) {
      throw new UnauthorizedRequestException();
    }
  
    const accessToken = authHeader.split(' ')[1];
  
    if (!accessToken) {
      throw new UnauthorizedRequestException();
    }
  
    const userData = tokenService.validateAccessToken(accessToken);
  
    if (!userData) {
      throw new UnauthorizedRequestException();
    }
  
    req.user = userData;
    next()
  } catch (error) {
    next(new UnauthorizedRequestException())
  }
}