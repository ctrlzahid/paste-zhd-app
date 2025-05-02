import { Schema, Document, models, model } from 'mongoose';

export interface IFeedback extends Document {
  message: string;
  email?: string;
  createdAt: Date;
  userAgent?: string;
  ip: string;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    message: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    ip: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = models.Feedback || model('Feedback', feedbackSchema);
