export const TokenType = {
  ForgotPasswordToken: "ForgotPasswordToken",
  AccessToken: "AccessToken",
  RefreshToken: "RefreshToken",
} as const;

export const Role = {
  Admin: "Admin",
  Seller: "Seller",
  Client: "Client",
} as const;

export const RoleValues = [Role.Admin, Role.Seller, Role.Client] as const;

export const ManagerRoom = "manager" as const;
