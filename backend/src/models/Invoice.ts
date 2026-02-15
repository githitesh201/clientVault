import { InferSchemaType, model, Schema } from 'mongoose';

const invoiceSchema = new Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    amount: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: '' },
    billingType: { type: String, enum: ['milestone', 'scheduled', 'full'], default: 'full' },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'issued', 'paid', 'overdue'], default: 'issued' },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

export type InvoiceDocument = InferSchemaType<typeof invoiceSchema>;
export const Invoice = model<InvoiceDocument>('Invoice', invoiceSchema);
