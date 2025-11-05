import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["stake", "payout", "withdrawal", "topup"],
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["card", "transfer"],
      default: "system",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);
