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

export interface ResponseGalery {
  imageId: number;
  imageUrl: string;
  createdAt: string;
  imageName: string;
}

export interface ResponseStore {
  storeId: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  maxCapacity: number;
  status: boolean;
  type: string;
  user: UserResponse;
  createdAt: string;
  observations: string;
}

export interface ResponseProductStore {
  productStoreId: number;
  product: Product;
  actualStock: number;
  reservedStock: number;
  availableStock: number;
  minStock: number;
  maxStock: number;
  avgCost: number;
  lastCost: number;
  status: boolean;
  createdAt: string;
}

export interface Product {
  productId: number;
  codeInternal: string;
  code: string;
  name: string;
  description: string;
  category: ResponseCategories;
  unit: ResponseUnit;
  priceBuy: number;
  priceSell: number;
  minStock: number;
  status: boolean;
  image: ResponseGalery;
}

export interface ResponseUsers {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: number;
  status: boolean;
}

export interface ResponseProvider {
  providerId: number;
  code: string;
  companyName: string;
  publicName: string;
  typeDocument: string;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  mainContact: string;
  contactPhone: string;
  payCondition: string;
  typeMoney: string;
  daysDelivery: number;
  status: boolean;
  createdAt: string;
  payConditionId: number;
}
