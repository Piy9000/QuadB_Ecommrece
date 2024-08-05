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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.tokenGenrate = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../../model/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenGenrate = (id) => {
    if (process.env.JWT_TOKEN) {
        const JWT = jsonwebtoken_1.default.sign({ _id: id }, process.env.JWT_TOKEN);
        return JWT;
    }
    return false;
};
exports.tokenGenrate = tokenGenrate;
const login = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user = yield user_1.User.findOne({ email: email });
        if (user) {
            const verify = yield bcryptjs_1.default.compare(password, user.password);
            const token = (0, exports.tokenGenrate)(user._id);
            console.log(user._id);
            if (verify && user) {
                return Object.assign(Object.assign({}, user._doc), { password: null, token });
            }
            else {
                return { status: false, msg: "wrong password" };
            }
        }
        return { status: false, msg: "user not found" };
    }
    catch (e) {
        return { status: false, msg: "somthing wrong", error: e };
    }
});
exports.login = login;
