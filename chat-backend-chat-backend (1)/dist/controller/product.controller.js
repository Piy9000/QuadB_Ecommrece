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
exports.ProductController = void 0;
const product_1 = require("../model/product");
class ProductController {
    constructor() {
        this.listProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield product_1.Product.find();
                res.status(200).json(products);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield product_1.Product.findById(id);
                if (!product) {
                    res.status(404).json({ error: "Product not found" });
                    return;
                }
                res.status(200).json(product);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.createProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, stock, category, image } = req.body;
            try {
                const newProduct = new product_1.Product({ name, description, price, stock, category, image });
                const product = yield newProduct.save();
                res.status(201).json(product);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.updateProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updates = req.body;
            try {
                const product = yield product_1.Product.findByIdAndUpdate(id, updates, { new: true });
                if (!product) {
                    res.status(404).json({ error: "Product not found" });
                    return;
                }
                res.status(200).json(product);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.deleteProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield product_1.Product.findByIdAndDelete(id);
                if (!product) {
                    res.status(404).json({ error: "Product not found" });
                    return;
                }
                res.status(200).json({ message: "Product deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.ProductController = ProductController;
