import { compare, hash } from 'bcryptjs';
import { InferSchemaType, model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'manager', 'staff', 'client'], default: 'staff' }
  },
  { timestamps: true }
);

userSchema.pre('save', async function preSave(this: any, next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 12);
  next();
});

userSchema.methods.verifyPassword = async function verifyPassword(candidate: string): Promise<boolean> {
  return compare(candidate, this.password);
};

type UserType = InferSchemaType<typeof userSchema>;
export interface UserDocument extends UserType {
  verifyPassword(candidate: string): Promise<boolean>;
}

export const User = model<UserDocument>('User', userSchema);
