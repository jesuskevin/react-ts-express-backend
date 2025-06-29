import passport from "passport";
import { UserModel } from "../models/user.js";
import bcrypt from 'bcrypt';

export class AuthController {
    static register = async (req, res) => {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const User = new UserModel({
            ...req.body,
            password: hashedPassword,
        });

        try {
            const newUser = await User.save();
            if (!newUser) return new Error("Somenthing went wrong. Please try again later.");
            return res.status(200).json({ message: "User created successfully." });
        } catch (err) {
            return res.status(500).json({ message: "Somenthing went wrong. Please try again later." });
        }
    }

    static login = async (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(422).json({ message: info?.message});

            req.logIn(user, err => {
                if (err) return next(err);

                const auth = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };

                return res.json({ auth });
            });
        })(req, res, next);
    }

    static logout = async (req, res) => {
        if (!req.user) return res.status(401).json({});
        req.logout((err) => {
            if (err) return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
            return res.status(200).json({});
        });
    }
}