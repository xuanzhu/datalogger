export enum UserRole {
  Admin = "Admin",
  DataloggerRead = "DataloggerRead",
  DataloggerWrite = "DataloggerWrite",
  PpdRead = "PpdRead",
  PpdWrite = "PpdWrite"
}

export interface IUser {
  UserName: string;
  Roles: {
    [UserRole.Admin]: boolean;
    [UserRole.DataloggerRead]: boolean;
    [UserRole.DataloggerWrite]: boolean;
    [UserRole.PpdRead]: boolean;
    [UserRole.PpdWrite]: boolean;
  };
}
