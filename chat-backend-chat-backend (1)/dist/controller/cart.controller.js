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
exports.CartController = void 0;
const cart_1 = require("../model/cart");
class CartController {
    constructor() {
        // Get the user's shopping cart
        this.getCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Access the user ID
                if (!userId) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const cart = yield cart_1.Cart.findOne({ userId });
                if (!cart) {
                    return res.status(404).json({ error: 'Cart not found' });
                }
                return res.json(cart);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
        // Add an item to the cart
        this.addToCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id; // Access the user ID
                if (!userId) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const { productId, quantity } = req.body;
                const cart = yield cart_1.Cart.findOneAndUpdate({ userId }, { $push: { items: { productId, quantity } } }, { new: true, upsert: true });
                return res.json(cart);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
        // Remove an item from the cart
        this.removeFromCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            try {
                const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id; // Access the user ID
                if (!userId) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const { itemId } = req.params;
                const cart = yield cart_1.Cart.findOneAndUpdate({ userId }, { $pull: { items: { _id: itemId } } }, { new: true });
                return res.json(cart);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.CartController = CartController;
