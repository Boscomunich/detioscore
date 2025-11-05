import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: { type: Number, default: 0 },
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
});

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
