import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: { type: Number, default: 0 },
});

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
