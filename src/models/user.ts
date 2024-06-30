// src/models/user.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  profile: {
    avatarUrl: string;
    bio: string;
  };
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profile: {
    avatarUrl: { type: String },
    bio: { type: String }
  }
});

UserSchema.set('toJSON', {
    virtuals: true
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
