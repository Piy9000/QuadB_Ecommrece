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
exports.UserController = void 0;
const create_service_1 = require("../service/userService/create.service");
const login_service_1 = require("../service/userService/login.service");
const serachUser_service_1 = require("../service/userService/serachUser.service");
const user_1 = require("../model/user");
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const result = yield (0, create_service_1.create)(req);
                if (result.error) {
                    return res.status(500).send({ success: false, msg: result.error });
                }
                return res.status(201).send({ success: true, data: result });
            }
            catch (error) {
                return res.status(500).send({ success: false, msg: error });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, login_service_1.login)(req);
                return res.status(200).send(result);
            }
            catch (error) {
                return res.status(400).send({ success: false, msg: error });
            }
        });
    }
    searchUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, serachUser_service_1.search)(req);
                return res.status(200).send(result);
            }
            catch (error) {
                return res.status(500).send({ success: false, msg: error });
            }
        });
    }
    loginWithAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.user || !req.body.user._id) {
                return res.status(400).send({ message: "ReLogin is required" });
            }
            try {
                const user = yield user_1.User.findById(req.body.user._id);
                if (!user) {
                    return res.status(400).send({ message: "ReLogin is required" });
                }
                const token = (0, login_service_1.tokenGenrate)(user._id);
                return res.status(200).send(Object.assign(Object.assign({}, user.toObject()), { password: null, token }));
            }
            catch (error) {
                return res.status(500).send({ success: false, msg: error });
            }
        });
    }
}
exports.UserController = UserController;
