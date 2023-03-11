import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  //TODO private key shouldn't be store in database
  privateKey: { type: String, required: true },
  publicKey: { type: String, required: true },
});

export interface User {
  _id: string;
  username: string;
  password: string;
  privateKey: string;
  publicKey: string;
}
