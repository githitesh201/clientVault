import { InferSchemaType, model, Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['todo', 'in_progress', 'blocked', 'completed'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date, required: true }
  },
  { timestamps: true }
);

export type TaskDocument = InferSchemaType<typeof taskSchema>;
export const Task = model<TaskDocument>('Task', taskSchema);
