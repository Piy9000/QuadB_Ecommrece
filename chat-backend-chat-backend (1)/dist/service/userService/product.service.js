"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createProduct = void 0;
const product_1 = require("../../model/product");
const uuid_1 = require("uuid");
// Create a new product
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, stock, category, image } = req.body;
    try {
        const product = yield product_1.Product.create({
            _id: (0, uuid_1.v4)(),
            name,
            description,
            price,
            stock,
            category,
            image
        });
        return Object.assign({}, product.toObject());
    }
    catch (error) {
        // Type assertion for error
        return { error: error.message };
    }
});
exports.createProduct = createProduct;
// Get a product by ID
const getProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_1.Product.findById(id);
        if (!product) {
            return { error: 'Product not found' };
        }
        return Object.assign({}, product.toObject());
    }
    catch (error) {
        // Type assertion for error
        return { error: error.message };
    }
});
exports.getProduct = getProduct;
// Update a product by ID
const updateProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updates = req.body;
    try {
        const product = yield product_1.Product.findByIdAndUpdate(id, updates, { new: true });
        if (!product) {
            return { error: 'Product not found' };
        }
        return Object.assign({}, product.toObject());
    }
    catch (error) {
        // Type assertion for error
        return { error: error.message };
    }
});
exports.updateProduct = updateProduct;
// Delete a product by ID
const deleteProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_1.Product.findByIdAndDelete(id);
        if (!product) {
            return { error: 'Product not found' };
        }
        return { message: 'Product deleted successfully' };
    }
    catch (error) {
        // Type assertion for error
        return { error: error.message };
    }
});
exports.deleteProduct = deleteProduct;
// List all products (with optional filtering)
const listProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, minPrice, maxPrice } = req.query;
    try {
        const query = {};
        if (category)
            query.category = category;
        if (minPrice)
            query.price = { $gte: Number(minPrice) };
        if (maxPrice)
            query.price = Object.assign(Object.assign({}, query.price), { $lte: Number(maxPrice) });
        const products = yield product_1.Product.find(query);
        return products.map(product => product.toObject());
    }
    catch (error) {
        // Type assertion for error
        return { error: error.message };
    }
});
exports.listProducts = listProducts;
