import bcrypt from "bcryptjs";
import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "manager", "staff", "client"],
      default: "staff",
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) return next();

  // ✅ Use bcrypt.hash()
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// ✅ Verify password method
userSchema.methods.verifyPassword = async function (
  candidate: string
): Promise<boolean> {
  // ✅ Use bcrypt.compare()
  return await bcrypt.compare(candidate, this.password);
};

type UserType = InferSchemaType<typeof userSchema>;

export interface UserDocument extends UserType {
  verifyPassword(candidate: string): Promise<boolean>;
}

export const User = model<UserDocument>("User", userSchema);
