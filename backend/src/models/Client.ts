import { InferSchemaType, model, Schema } from 'mongoose';

const clientSchema = new Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['lead', 'active', 'inactive'], default: 'lead' },
    notes: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export type ClientDocument = InferSchemaType<typeof clientSchema>;
export const Client = model<ClientDocument>('Client', clientSchema);
