import { InferSchemaType, model, Schema } from 'mongoose';

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['planned', 'active', 'on_hold', 'completed'], default: 'planned' },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    budget: { type: Number, min: 0, default: 0 },
    milestones: [{ title: String, amount: Number, dueDate: Date }]
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema>;
export const Project = model<ProjectDocument>('Project', projectSchema);
