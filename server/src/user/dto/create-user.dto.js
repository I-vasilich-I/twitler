export default class CreateUserDto {
  constructor(data) {
    this.email = data.email;
    this.username = data.username;
    this.password = data.password
  }
}
