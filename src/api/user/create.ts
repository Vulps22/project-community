// src/user/create.ts

import { Request, Response } from 'express';
import { argon2id, hash } from 'argon2';

import HttpMethod from '../../enum/httpMethod';
import Handler from '../../interfaces/handler';
import User, { IUser } from '../../models/user';

const createUserHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: false,
    execute: async (req: Request, res: Response) => {
        const { username, email, password, avatarUrl, bio } = req.body;

        try {

            const passwordHash = await hash(password, { type: argon2id });

            const newUser: IUser = new User({
                username,
                email,
                passwordHash,
                profile: {
                    avatarUrl,
                    bio
                }
            });
            const savedUser = await newUser.save();
            res.json({ message: 'User created successfully', data: savedUser });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Error creating user' });
        }
    }
};

export default createUserHandler;
