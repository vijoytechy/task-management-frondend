export type Role = {
  _id: string;
  name: "Admin" | "Developer" | "Tester" | string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Status = "Pending" | "In Progress"  | "Done" ;

export type User = {
  _id: string;
  name: string;
  email: string;
  role?: Role;
  isActive?: boolean;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  createdBy?: string | User;
  assignedTo?: User | null;
  createdAt?: string;
  updatedAt?: string;
};
