import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  ip: string;
  event: 'create' | 'view' | 'delete';
  pasteId?: string;
  pasteSlug?: string;
  syntax?: string;
  timestamp: Date;
  userAgent?: string;
}

export interface IUsageLimit extends Document {
  ip: string;
  date: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>({
  ip: { type: String, required: true, index: true },
  event: { type: String, required: true, enum: ['create', 'view', 'delete'] },
  pasteId: { type: String, index: true },
  pasteSlug: { type: String, index: true },
  syntax: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
  userAgent: { type: String },
});

const usageLimitSchema = new Schema<IUsageLimit>(
  {
    ip: { type: String, required: true, index: true },
    date: { type: String, required: true },
    count: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create a compound index for IP and date
usageLimitSchema.index({ ip: 1, date: 1 }, { unique: true });

export const AnalyticsEvent =
  models.AnalyticsEvent || model('AnalyticsEvent', analyticsEventSchema);
export const UsageLimit =
  models.UsageLimit || model('UsageLimit', usageLimitSchema);
