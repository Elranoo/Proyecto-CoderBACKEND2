export default class ProductRepository {
  constructor(dao) { this.dao = dao; }

  getProducts = () => this.dao.getAll();
  getProductById = id => this.dao.getById(id);
  createProduct = data => this.dao.create(data);
  updateProduct = (id, data) => this.dao.update(id, data);
  deleteProduct = id => this.dao.delete(id);
}