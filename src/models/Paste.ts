import { Schema, model, models } from 'mongoose';

const pasteSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    syntax: {
      type: String,
      required: true,
      default: 'text',
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    ip: {
      type: String,
      required: false,
      default: 'unknown',
    },
    userAgent: {
      type: String,
      required: false,
      default: 'unknown',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create TTL index for auto-deletion
pasteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Paste = models.Paste || model('Paste', pasteSchema);
