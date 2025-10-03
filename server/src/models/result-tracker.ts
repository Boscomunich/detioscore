import { Schema, Document, model } from "mongoose";

export interface IFixtureChunk extends Document {
  fixtureIds: string; // concatenated string "id-id-id"
  fixtures: {
    fixtureId: number;
    date: Date;
    status: {
      short: string;
      long: string;
      elapsed: number | null;
    };
    teams: {
      home: {
        id: number;
        name: string;
        logo: string;
        winner: boolean | null;
      };
      away: {
        id: number;
        name: string;
        logo: string;
        winner: boolean | null;
      };
    };
    score: {
      halftime: { home: number | null; away: number | null };
      fulltime: { home: number | null; away: number | null };
    };
  }[];
  createdAt: Date;
  expiresAt: Date;
}

const FixtureChunkSchema = new Schema<IFixtureChunk>(
  {
    fixtureIds: { type: String, required: true, unique: true },

    fixtures: {
      type: [
        {
          fixtureId: { type: Number, required: true },
          date: { type: Date, required: true },
          status: {
            short: { type: String, required: true },
            long: { type: String, required: true },
            elapsed: { type: Number, default: null },
          },
          teams: {
            home: {
              id: { type: Number, required: true },
              name: { type: String, required: true },
              logo: { type: String, default: "" },
              winner: { type: Boolean, default: null },
            },
            away: {
              id: { type: Number, required: true },
              name: { type: String, required: true },
              logo: { type: String, default: "" },
              winner: { type: Boolean, default: null },
            },
          },
          score: {
            halftime: {
              home: { type: Number, default: null },
              away: { type: Number, default: null },
            },
            fulltime: {
              home: { type: Number, default: null },
              away: { type: Number, default: null },
            },
          },
        },
      ],
      default: [],
    },

    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index: auto-delete 24h after expiry
FixtureChunkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Auto set expiresAt = createdAt + 24h
FixtureChunkSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    const expiry = new Date(this.createdAt.getTime() + 24 * 60 * 60 * 1000);
    this.expiresAt = expiry;
  }
  next();
});

export default model<IFixtureChunk>("FixtureChunk", FixtureChunkSchema);
