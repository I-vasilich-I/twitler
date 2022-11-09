export default class UserDto {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.isActivated = user.isActivated;
    this.bio = user.bio;
    this.avatar = user.avatar;
  }
}