import { Request, Response } from "express";
import { create } from "../service/userService/create.service";
import { login, tokenGenrate } from "../service/userService/login.service";
import { search } from "../service/userService/serachUser.service";
import { User } from "../model/user";

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            console.log(req.body)
            const result = await create(req);
            if (result.error) {
                return res.status(500).send({ success: false, msg: result.error });
            }
            return res.status(201).send({ success: true, data: result });
        } catch (error) {
            return res.status(500).send({ success: false, msg: error });
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const result = await login(req);
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send({ success: false, msg: error });
        }
    }

    async searchUser(req: Request, res: Response) {
        try {
            const result = await search(req);
            return res.status(200).send(result);
        } catch (error) {
            return res.status(500).send({ success: false, msg: error });
        }
    }

    async loginWithAccessToken(req: Request, res: Response) {
        if (!req.body.user || !req.body.user._id) {
            return res.status(400).send({ message: "ReLogin is required" });
        }

        try {
            const user = await User.findById(req.body.user._id);
            if (!user) {
                return res.status(400).send({ message: "ReLogin is required" });
            }
            const token = tokenGenrate(user._id);
            return res.status(200).send({ ...user.toObject(), password: null, token });
        } catch (error) {
            return res.status(500).send({ success: false, msg: error });
        }
    }
}
