import mongoose from 'mongoose';

const creditScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 300,
    max: 850
  },
  factors: {
    paymentHistory: Number,
    creditUtilization: Number,
    creditAge: Number,
    creditMix: Number,
    newCredit: Number
  },
  inputs: {
    income: Number,
    creditCards: Number,
    loans: Number,
    paymentHistory: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

creditScoreSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('CreditScore', creditScoreSchema);