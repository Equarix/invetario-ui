export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  errors: Record<string, string[]>;
}

export interface PaginateResponse<T> {
  items: T;
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
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

export interface ResponseClient {
  clientId: number;
  clientTypeId: number;
  clientType: string;
  name: string;
  typeDocument: string;
  documentNumber: string;
  phone: string;
  email: string;
  status: boolean;
  createdAt: string;
}

export interface EntryOrderResponse {
  entryOrderId: number;
  provider: ResponseProvider;
  store: ResponseStore;
  entryDate: string;
  createdAt: string;
  entryOrderType: number;
  typeMoney: string;
  payCondition: string;
  tax: number;
  entryOrderStatus: string;
  observation: string;
  entryOrderDetails: EntryOrderDetail[];
}

export interface EntryOrderDetail {
  entryOrderDetailId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  entryOrderDetailStatus: number;
  createdAt: string;
}

export interface ResponseUserStore {
  storeUserId: number;
  store: ResponseStore;
  user: UserResponse;
  createdAt: string;
  status: boolean;
}

export interface ResponseBox {
  boxId: number;
  amountOpening: number;
  amountClosing?: number;
  dateOpening: string;
  dateClosing?: Date;
  userOpening: UserResponse;
  userClosing: UserResponse;
  userActual: UserResponse;
  isOpen: boolean;
}

export interface ResponsePayMethod {
  paymethodId: number;
  name: string;
  status: boolean;
  turned: boolean;
}

export interface ResponseConfig {
  configId: number;
  enterpriseName: string;
  contactEmail: string;
  ruc: string;
  address: string;
  phone: string;
  logoUrl: string;
  localCurrency: string;
  createdAt: string;
}

export interface SaleDetailResponse {
  saleDetailId: number;
  product: Product;
  productName: string;
  quantity: number;
  priceSell: number;
}

export interface SaleMethodResponse {
  saleMethodId: number;
  methodPayment: string;
  amount: number;
  paymethod: ResponsePayMethod;
}

export interface ResponseSale {
  saleId: number;
  client: ResponseClient;
  user: UserResponse;
  total: number;
  observations: string;
  saleMethods: SaleMethodResponse[];
  saleDetails: SaleDetailResponse[];
  createdAt: string;
  status: boolean;
  typeDocument: string;
  typeMoney: string;
  store: ResponseStore;
}

export interface ResponseChats {
  chatId: number;
  message: string;
  userId: number;
  user: UserResponse;
  createdAt: string;
  storeId: number;
}
