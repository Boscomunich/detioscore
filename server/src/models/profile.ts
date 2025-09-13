import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one-to-one relationship
    },

    // Wallet balance
    coins: { type: Number, default: 0 },
    // Payout account details
    payoutDetails: {
      type: {
        bank: {
          accountName: { type: String },
          accountNumber: { type: String },
          bankName: { type: String },
          routingNumber: { type: String },
        },
      },
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserProfile", UserProfileSchema);
