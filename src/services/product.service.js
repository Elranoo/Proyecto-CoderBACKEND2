export default class ProductService {
  constructor(repository) { this.repository = repository; }

  getProducts = () => this.repository.getProducts();
  getProductById = id => this.repository.getProductById(id);
  createProduct = data => this.repository.createProduct(data);
  updateProduct = (id, data) => this.repository.updateProduct(id, data);
  deleteProduct = id => this.repository.deleteProduct(id);
}