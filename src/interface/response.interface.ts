export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  errors: Record<string, string[]>;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  userId: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: number;
  status: boolean;
  token: string;
  //   stores: any[]
}

export interface ResponseCategories {
  categoryId: number;
  name: string;
  description: string;
  status: boolean;
}

export interface ResponseUnit {
  unitId: number;
  name: string;
  description: string;
  status: boolean;
}
