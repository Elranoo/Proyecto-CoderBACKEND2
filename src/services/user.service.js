export default class UserService {
  constructor(repository) { this.repository = repository; }

  async registerUser(data) {
    const exists = await this.repository.getUserByEmail(data.email);
    if (exists) throw new Error("Usuario ya existe");
    return this.repository.createUser(data);
  }

  async getUserByEmail(email) { return this.repository.getUserByEmail(email); }
  async updateUser(id, data) { return this.repository.updateUser(id, data); }
}