// src/models/channel.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

import ChannelType from '../enum/channelType';

interface IChannel extends Document {
  _id?: string;
  name: string;
  type: ChannelType;
  createdAt: Date;
}

const ChannelSchema: Schema = new Schema({
  _id: { type: String, default: () => new Types.ObjectId().toHexString() }, // Automatically generate a UUID for _id
  name: { type: String, required: true },
  type: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default ChannelSchema;
export { IChannel };
