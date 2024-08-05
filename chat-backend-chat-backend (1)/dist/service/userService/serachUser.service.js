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
exports.search = void 0;
const user_1 = require("../../model/user");
const joiValidation_1 = require("../../helper/joiValidation");
const search = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const phoneNumber = req.body.phoneNumber || req.query.phoneNumber;
    const keyword = phoneNumber
        ? {
            phoneNumber: { $regex: phoneNumber, $options: "i" },
        }
        : {};
    const result = joiValidation_1.searchJoi.validate({ phoneNumber: phoneNumber });
    if (result.error) {
        const { error } = result;
        return { validate: false, msg: error };
    }
    try {
        const user = yield user_1.User.find(keyword).find({
            _id: { $ne: req.body.user._id },
        });
        return user;
    }
    catch (error) {
        console.log(error);
    }
});
exports.search = search;
