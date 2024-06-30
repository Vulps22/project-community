import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import ChannelSchema, { IChannel } from './channel';
import User from './user';

interface IServer extends Document {
  name: string;
  description: string;
  channels: Types.DocumentArray<IChannel>;
  ownerId: Types.ObjectId;
  members: Types.ObjectId,
  createdAt: Date;
}

// Define property overrides for hydrated documents
type THydratedServerDocument = Document<Types.ObjectId, any, IServer> & IServer & {
  _id: Types.ObjectId;
  channels: Types.DocumentArray<IChannel>;
};

type ServerModelType = Model<IServer, {}, {}, {}, THydratedServerDocument>;

const ServerSchema: Schema<IServer, ServerModelType> = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "That New Server Smell" },
  channels: { type: [ChannelSchema], default: [] },
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  createdAt: { type: Date, default: Date.now }
});

const Server = mongoose.model<IServer, ServerModelType>('Server', ServerSchema);
export default Server;
export { IServer, THydratedServerDocument };
