export {};

declare module "better-auth/react" {
  interface BetterAuthUser {
    country?: string;
    role?: "user" | "admin" | "super_admin";
  }
}
