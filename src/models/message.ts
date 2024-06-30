import mongoose, { Document, Schema, Types } from 'mongoose';
import User from './user';


export interface IMessage extends Document {
  serverId: Types.ObjectId;
  channelId: string;
  sender: Types.ObjectId;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
  serverId: { type: Schema.Types.ObjectId, required: true, ref: 'Server' },
  channelId: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
