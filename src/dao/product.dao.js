import { ProductModel } from "../models/product.model.js";

export default class ProductDAO {
  getAll = () => ProductModel.find();
  getById = id => ProductModel.findById(id);
  create = product => ProductModel.create(product);
  update = (id, data) => ProductModel.findByIdAndUpdate(id, data, { new: true });
  delete = id => ProductModel.findByIdAndDelete(id);
}