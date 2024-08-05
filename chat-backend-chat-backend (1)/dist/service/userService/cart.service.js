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
exports.listCarts = exports.clearCart = exports.removeItemFromCart = exports.addItemToCart = exports.getCart = exports.createOrUpdateCart = void 0;
const cart_1 = require("../../model/cart");
// Create a new cart or update an existing cart
const createOrUpdateCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, items } = req.body;
    try {
        // Check if cart exists
        let cart = yield cart_1.Cart.findOne({ userId }).exec();
        if (cart) {
            // Update existing cart
            cart.items = items;
            yield cart.save();
            return Object.assign({}, cart.toObject());
        }
        else {
            // Create new cart
            cart = yield cart_1.Cart.create({ userId, items });
            return Object.assign({}, cart.toObject());
        }
    }
    catch (error) {
        return { error: error.message };
    }
});
exports.createOrUpdateCart = createOrUpdateCart;
// Get a cart by user ID
const getCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const cart = yield cart_1.Cart.findOne({ userId }).exec();
        if (!cart) {
            return { error: 'Cart not found' };
        }
        return Object.assign({}, cart.toObject());
    }
    catch (error) {
        return { error: error.message };
    }
});
exports.getCart = getCart;
// Add an item to the cart
const addItemToCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    try {
        let cart = yield cart_1.Cart.findOne({ userId }).exec();
        if (!cart) {
            cart = yield cart_1.Cart.create({ userId, items: [{ productId, quantity }] });
        }
        else {
            const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
            if (existingItemIndex > -1) {
                // Update quantity of existing item
                cart.items[existingItemIndex].quantity += quantity;
            }
            else {
                // Add new item
                cart.items.push({ productId, quantity });
            }
            yield cart.save();
        }
        return Object.assign({}, cart.toObject());
    }
    catch (error) {
        return { error: error.message };
    }
});
exports.addItemToCart = addItemToCart;
// Remove an item from the cart
const removeItemFromCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = req.params;
    try {
        const cart = yield cart_1.Cart.findOne({ userId }).exec();
        if (!cart) {
            return { error: 'Cart not found' };
        }
        // Remove the item
        cart.items = cart.items.filter(item => item.productId !== productId);
        yield cart.save();
        return Object.assign({}, cart.toObject());
    }
    catch (error) {
        return { error: error.message };
    }
});
exports.removeItemFromCart = removeItemFromCart;
// Clear the cart
const clearCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const cart = yield cart_1.Cart.findOne({ userId }).exec();
        if (!cart) {
            return { error: 'Cart not found' };
        }
        cart.items = [];
        yield cart.save();
        return { message: 'Cart cleared successfully' };
    }
    catch (error) {
        return { error: error.message };
    }
});
exports.clearCart = clearCart;
// List all carts (for administrative purposes)
const listCarts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carts = yield cart_1.Cart.find().exec();
        return carts.map(cart => cart.toObject());
    }
    catch (error) {
        return { error: error.message };
    }
});
exports.listCarts = listCarts;
