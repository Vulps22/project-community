import { Request, Response } from 'express';
import { argon2id, hash } from 'argon2';
import jwt from 'jsonwebtoken';
import HttpMethod from '../../enum/httpMethod';
import Handler from '../../handlers/handler';
import User, { IUser } from '../../models/user';
import { Interaction } from '../../utility/interaction';
import getToken from '../../../config/jwt-token';

const JWT_SECRET: string = getToken();

const createUserHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: false,
    execute: async (interaction: Interaction) => {
        const { username, email, password, avatarUrl = '', bio = '' } = interaction.req.body;

        try {
            // Hash the password
            const passwordHash = await hash(password, { type: argon2id });

            // Create new user
            const newUser: IUser = new User({
                username,
                email,
                passwordHash,
                profile: {
                    avatarUrl,
                    bio,
                }
            });

            // Save the user to the database
            const savedUser = await newUser.save();

            // Generate a JWT token
            const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
                expiresIn: '365d'
            });

            // Exclude password hash and email from the response
            const responseData = {
                id: savedUser._id,
                username: savedUser.username,
                profile: savedUser.profile,
                createdAt: savedUser.createdAt,
                token: token,
            };

            interaction.res.json({ message: 'User created successfully', data: responseData });
        } catch (error) {
            console.error('Error creating user:', error);
            interaction.res.status(500).json({ message: 'Error creating user' });
        }
    }
};

export default createUserHandler;
