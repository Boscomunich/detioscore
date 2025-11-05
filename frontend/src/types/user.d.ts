export interface User {
  _id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: "user" | "admin" | "super_admin";
  ipAddresses: { ip?: string | null; lastUsed?: string }[];
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  suspended: boolean;
  suspensionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export {};
