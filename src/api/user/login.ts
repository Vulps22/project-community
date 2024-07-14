// src/api/users/login.ts

import { Request, Response } from 'express';
import HttpMethod from '../../enum/httpMethod';
import Handler from '../../handlers/handler';
import User from '../../models/user';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import getToken from '../../../config/jwt-token';
import { Interaction } from '../../utility/interaction';



const JWT_SECRET: string = getToken();

const loginHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: false,

    execute: async (interaction: Interaction) => {
        const { email, password } = interaction.req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return interaction.res.status(401).json({ message: 'Invalid email or password' });
            }

            const validPassword = await argon2.verify(user.passwordHash, password);
            if (!validPassword) {
                return interaction.res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
                expiresIn: '365d'
            });

            interaction.res.json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error during login:', error);
            interaction.res.status(500).json({ message: 'Error during login' });
        }
    }
};

export default loginHandler;
