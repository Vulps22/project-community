// src/user/create.ts

import { Request, Response } from 'express';
import { argon2id, hash } from 'argon2';

import HttpMethod from '../../enum/httpMethod';
import Handler from '../../interfaces/handler';
import User, { IUser } from '../../models/user';
import { Interaction } from '../../utility/interaction';

const createUserHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: false,
    execute: async (interaction: Interaction) => {
        const { username, email, password, avatarUrl, bio } = interaction.req.body;

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
            interaction.res.json({ message: 'User created successfully', data: savedUser });
        } catch (error) {
            console.error('Error creating user:', error);
            interaction.res.status(500).json({ message: 'Error creating user' });
        }
    }
};

export default createUserHandler;
