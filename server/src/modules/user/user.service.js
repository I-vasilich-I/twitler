import { hash, compare } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import {
  BadRequestException, UnauthorizedRequestException, NotFoundException, ConflictException,
} from '../../exceptions/index.js';
import { ERROR_MESSAGES } from '../../constants.js';
import { deleteFile, getActivationLink } from '../../helpers.js';
import tokenService from '../token/token.service.js';
import mailerService from '../mailer/mailer.service.js';
import prisma from '../prisma/prisma.service.js';
import UserDto from './dto/user.dto.js';

const HASH_ROUNDS = +process.env.HASH_ROUNDS || 10;
const { USER_WITH_EMAIL_EXIST, WRONG_CREDS, ENTITY_WITH_ID_DOES_NOT_EXIST } = ERROR_MESSAGES;

class UserService {
  async signUp({ username, email, password }) {
    const condidate = await prisma.user.findUnique({ where: { email } });

    if (condidate) {
      throw new ConflictException(USER_WITH_EMAIL_EXIST(email));
    }

    const hashPassword = await hash(password, HASH_ROUNDS);
    const activationLink = uuidV4();
    const user = await prisma.user.create({
      data: {
        email, password: hashPassword, username, activationLink,
      },
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens(userDto);

    await prisma.user.update({ where: { email }, data: { refreshToken: tokens.refreshToken } });

    const link = getActivationLink(user.activationLink);

    await mailerService.sendActivationMail(user.email, user.username, link);

    return { user: userDto, tokens };
  }

  async signIn({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException(WRONG_CREDS);
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException(WRONG_CREDS);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens(userDto);
    await prisma.user.update({ where: { email }, data: { refreshToken: tokens.refreshToken } });

    return { user: userDto, tokens };
  }

  async logOut(email) {
    await prisma.user.update({ where: { email }, data: { refreshToken: null } });
  }

  async activate(link) {
    await prisma.user.update({ where: { activationLink: link }, data: { isActivated: true } });
  }

  async refresh(token) {
    if (!token) {
      throw new UnauthorizedRequestException();
    }

    const userData = tokenService.validateRefreshToken(token);

    if (!userData) {
      throw new UnauthorizedRequestException();
    }

    const user = await prisma.user.findUnique({ where: { id: userData.id } });
    const { id, refreshToken } = user;
    const isEquelToTokenInDb = token === refreshToken;

    if (!isEquelToTokenInDb) {
      await prisma.user.update({ where: { id }, data: { refreshToken: null } });
      throw new UnauthorizedRequestException();
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens(userDto);
    await prisma.user.update({ where: { id }, data: { refreshToken: tokens.refreshToken } });

    return {
      user: userDto,
      tokens,
    };
  }

  async getById(id, loggedUserId) {
    if (!id) {
      throw new BadRequestException();
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
        followers: {
          where: {
            followerUserId: loggedUserId,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('User', id));
    }

    const responseUser = new UserDto(user);
    const { _count, followers } = user;

    return { ...responseUser, _count, amIFollowing: Boolean(followers.length) };
  }

  async updateInfo(data, id) {
    if (!data) {
      throw new BadRequestException();
    }

    const { username, email, bio } = data;
    const newData = { bio };

    if (username) {
      newData.username = username;
    }

    if (email) {
      newData.email = email;
    }

    const userData = await prisma.user.update({ where: { id }, data: newData });

    if (!userData) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('User', id));
    }

    return new UserDto(userData);
  }

  async updateAvatar(id, avatarData) {
    if (!avatarData?.path) {
      throw new BadRequestException();
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('User', id));
    }

    const oldAvatar = user.avatar;
    const avatar = avatarData.path;
    const userData = await prisma.user.update({ where: { id }, data: { avatar } });

    if (oldAvatar) {
      await deleteFile(oldAvatar);
    }

    return new UserDto(userData);
  }

  async removeAvatar(id) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('User', id));
    }

    const oldAvatar = user.avatar;
    const avatar = null;
    const userData = await prisma.user.update({ where: { id }, data: { avatar } });

    if (oldAvatar) {
      await deleteFile(oldAvatar);
    }

    return new UserDto(userData);
  }

  async updatePassword({ id, oldPassword, newPassword }) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('User', id));
    }

    const isPasswordCorrect = await compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException();
    }

    const password = await hash(newPassword, HASH_ROUNDS);

    await prisma.user.update({ where: { id }, data: { password } });
  }

  async delete(id) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(ENTITY_WITH_ID_DOES_NOT_EXIST('User', id));
    }

    await deleteFile(user.avatar);

    await prisma.user.delete({ where: { id } });
  }
}

export default new UserService();
