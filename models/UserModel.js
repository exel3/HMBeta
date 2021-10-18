export class UserModel {
  constructor(userDate) {
    this.username = userDate.username
    this.password = userDate.password
    this.type = userDate.type
  }
}