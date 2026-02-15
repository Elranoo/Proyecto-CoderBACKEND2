export default class UserRepository {
  constructor(dao) { this.dao = dao; }

  getUserByEmail = email => this.dao.getByEmail(email);
  getUserById = id => this.dao.getById(id);
  createUser = user => this.dao.create(user);
  updateUser = (id, data) => this.dao.update(id, data);
}