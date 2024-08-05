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
exports.create = exports.passwordHash = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../../model/user");
const uuid_1 = require("uuid");
const passwordHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.hash(password, 8);
});
exports.passwordHash = passwordHash;
const create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // const result = userSchema.validate(req.body);
    // if (result.error) {
    //   return { error: result.error.details };
    // }
    const hashedPassword = yield (0, exports.passwordHash)(password);
    req.body["password"] = hashedPassword;
    try {
        const emailExist = yield user_1.User.findOne({ email });
        if (emailExist) {
            return { email: "Email already exists" };
        }
        else {
            const user = yield user_1.User.create(Object.assign(Object.assign({}, req.body), { _id: (0, uuid_1.v4)() }));
            //const token = tokenGenrate(user._id);
            return Object.assign({}, user.toObject()); // Convert user to plain object
        }
    }
    catch (error) {
        console.log('first', error);
        return { error };
    }
});
exports.create = create;
