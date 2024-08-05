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
const joiValidation_1 = require("../../helper/joiValidation");
const user_1 = require("../../model/user");
const passwordHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const Password = yield bcryptjs_1.default.hash(password, 8);
    return Password;
});
exports.passwordHash = passwordHash;
const create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // if you want file in req object install multer 
    // req.body['pic'] = req.file?.filename;
    // console.log(req.file?.filename);
    const result = joiValidation_1.userSchema.validate(Object.assign({}, req.body));
    if (result.error) {
        const { error } = result;
        return { validate: false, msg: error };
    }
    const setPassword = yield (0, exports.passwordHash)(password);
    req.body['password'] = setPassword;
    try {
        const emailExist = yield user_1.User.findOne({ email: email });
        if (emailExist) {
            return { email: "email exist" };
        }
        else {
            const user = new user_1.User(Object.assign({}, req.body));
            const data = yield user.save();
            return data;
        }
    }
    catch (error) {
        return error;
    }
});
exports.create = create;
