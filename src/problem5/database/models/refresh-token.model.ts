import mongoose, { Schema, Document } from 'mongoose'

interface IRefreshToken extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  token: string;
}

const RefreshTokenSchema = new Schema(
  {
    user_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
    token: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
)

export const RefreshTokenModel = mongoose.model<IRefreshToken>(
  'refresh_tokens',
  RefreshTokenSchema
)