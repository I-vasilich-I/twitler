import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { BadRequestException, UnauthorizedRequestException } from '../exceptions/index.js';
import { deleteFile } from '../helpers.js';
import { BASE_URL } from '../constants.js';
import UserDto from './dto/user.dto.js';
import tokenService from '../token/token.service.js';
import mailerService from '../mailer/mailer.service.js';

const prisma = new PrismaClient();
const HASH_ROUNDS = +process.env.HASH_ROUNDS || 10;

class UserService {
  async signUp({ username, email, password }) {
    const condidate = await prisma.user.findUnique({ where: { email }})
    if (condidate) {
      throw new BadRequestException(`User with email: ${email} already exist`)
    }

    const hashPassword = await hash(password, HASH_ROUNDS);
    const activationLink = uuidV4();
    const user = await prisma.user.create({ data: { email, password: hashPassword, username, activationLink }})
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens(userDto);
    await prisma.user.update({ where: { email }, data: { refreshToken: tokens.refreshToken } });

    const link = `${BASE_URL}/user/activate/${user.activationLink}`;
    await mailerService.sendActivationMail(user.email, user.username, link);
    
    return { user: userDto, tokens }
  }

  async signIn({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) {
      throw new BadRequestException()
    }
    
    const isPasswordCorrect = await compare(password, user.password);
    if(!isPasswordCorrect) {
      throw new BadRequestException()
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens(userDto);
    await prisma.user.update({ where: { email }, data: { refreshToken: tokens.refreshToken }});
    return { user: userDto, tokens }
  }

  async logOut(email) {
    await prisma.user.update({ where: { email }, data: { refreshToken: null }})
  }  

  async activate(link) {
    await prisma.user.update({ where: { activationLink: link }, data: { isActivated: true }});
  }

  async refresh(token) {
    if (!token) {
      throw new UnauthorizedRequestException()
    }

    const userData = tokenService.validateRefreshToken(token);

    if (!userData) {
      throw new UnauthorizedRequestException()
    }

    const user = await prisma.user.findUnique({ where: { id: userData.id }});
    const { id, refreshToken } = user;
    const isEquelToTokenInDb = token === refreshToken;

    if (!isEquelToTokenInDb) {
      await prisma.user.update({ where: { id }, data: { refreshToken: null }});
      throw new UnauthorizedRequestException()
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens(userDto);
    await prisma.user.update({ where: { id }, data: { refreshToken: tokens.refreshToken }});
    return {
      user: userDto,
      tokens
    }
  }

  async getById(id) {
    if (!id) {
      throw new BadRequestException();
    }

    const user = await prisma.user.findUnique({ where: { id }});
    
    if (!user) {
      throw new BadRequestException(`User with id: ${id} doesn't exist`);
    }

    return new UserDto(user);
  }

  async updateInfo(data, id, avatarData) {
    if (!data && !avatarData) {
      throw new BadRequestException();
    }
    let oldAvatar;

    const { userName, email, bio } = data;
    const newData = {};
    if (userName) {
      newData.username = userName;
    }

    if (email) {
      newData.email = email;
    }

    if (bio) {
      newData.bio = bio;
    }
    
    if (avatarData.path) {
      const user = await prisma.user.findUnique({ where: { id }});
      oldAvatar = user.avatar;
      newData.avatar = avatarData.path;
    }

    const userData = await prisma.user.update({ where: { id }, data: newData });

    if (oldAvatar) {
      await deleteFile(oldAvatar);
    }

    return new UserDto(userData);
  }

  async updatePassword({ id, oldPassword, newPassword }) {
    const user = await prisma.user.findUnique({ where: { id }});
    const isPasswordCorrect = await compare(oldPassword, user.password);
    if(!isPasswordCorrect) {
      throw new BadRequestException()
    }

    const password = await hash(newPassword, HASH_ROUNDS);
    await prisma.user.update({ where: { id }, data: { password }})
  }

  async delete(id) {
    const user = await prisma.user.findUnique({ where: { id }});

    if (!user) {
      throw new BadRequestException()
    }

    await deleteFile(user.avatar);

    await prisma.user.delete({ where: { id }});
  }


}

export default new UserService();
