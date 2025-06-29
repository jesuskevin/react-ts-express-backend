import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.js";
import bcrypt from 'bcrypt';

export const authRouter = Router();

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, callback) => {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return callback(null, false, { message: "These credetentials do not match our records." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return callback(null, false, { message: "These credetentials do not match our records." });

    return callback(null, user);
}));

passport.serializeUser(function (user, callback) {
    process.nextTick(function () {
        callback(null, user);
    });
});

passport.deserializeUser(async (user, callback) => {
    try {
        const userFound = await UserModel.findByPk(user.id);
        if (!userFound) return callback(null, false);
        callback(null, {id: userFound.id, email: userFound.email, name: userFound.name});
    } catch (err) {
        callback(err);
    }
});

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);

authRouter.post('/logout', passport.authenticate('session'), AuthController.logout);

authRouter.post('/user', passport.authenticate('session'), (req, res) => {
    console.log(req.user);
    return res.json(req.user);
});