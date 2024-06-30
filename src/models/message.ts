import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  channelId: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  channelId: { type: String, required: true, ref: 'Channel' },
  sender: { type: String, required: true, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
