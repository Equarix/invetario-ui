import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/hooks/useAlert";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  ApiResponse,
  ResponseBox,
  ResponseClient,
  ResponseProductStore,
  ResponsePayMethod,
  ResponseConfig,
  ResponseSale,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ClientInput } from "@/schemas/client/client.schema";

export interface SaleItem {
  productStoreId: number;
  product: ResponseProductStore["product"];
  quantity: number;
  price: number;
  discount: number;
  total: number;
  stock: number;
}

export interface SalePayment {
  payMethodId: number;
  name: string;
  amount: number;
  turned: boolean;
}

export enum TypeMoney {
  SOL = 0,
  DOLAR = 1,
}

export enum TypeDocumentSale {
  BOLETA = 0,
  FACTURA = 1,
}

export function useCreateSale() {
  const { token, storeId } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // Search states
  const [clientTerm, setClientTerm] = useState("");
  const [productTerm, setProductTerm] = useState("");

  const debouncedClientTerm = useDebounce(clientTerm);
  const debouncedProductTerm = useDebounce(productTerm);

  // Sale states
  const [selectedClient, setSelectedClient] = useState<ResponseClient | null>(
    null,
  );
  const [items, setItems] = useState<SaleItem[]>([]);
  const [payments, setPayments] = useState<SalePayment[]>([]);
  const [observation, setObservation] = useState("");
  const [typeMoney, setTypeMoney] = useState<TypeMoney>(TypeMoney.SOL);
  const [typeDocument, setTypeDocument] = useState<TypeDocumentSale>(
    TypeDocumentSale.BOLETA,
  );

  // Success state
  const [createdSale, setCreatedSale] = useState<ResponseSale | null>(null);

  const { data, isError, isLoading } = useQuery<ApiResponse<ResponseBox>>({
    queryKey: ["boxes"],
    queryFn: async () => {
      const res = await instance.get("/box/open", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    retry: false,
  });

  const { data: config } = useQuery<ApiResponse<ResponseConfig>>({
    queryKey: ["config"],
    queryFn: async () => {
      const res = await instance.get("/config/last", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { data: payMethods } = useQuery<ApiResponse<ResponsePayMethod[]>>({
    queryKey: ["paymethods"],
    queryFn: async () => {
      const res = await instance.get("/paymethod", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (isError) {
      showAlert("No hay cajas abiertas", "error");
      navigate("/venta");
    }
  }, [isError, data]);

  // Search Queries
  const { data: clients, isFetching: isSearchingClient } = useQuery<
    ApiResponse<ResponseClient[]>
  >({
    queryKey: ["client-search", debouncedClientTerm],
    queryFn: async () => {
      const res = await instance.get(
        `/client/search?documentNumber=${debouncedClientTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    enabled: debouncedClientTerm.length > 0,
  });

  const { data: products, isFetching: isSearchingProduct } = useQuery<
    ApiResponse<ResponseProductStore[]>
  >({
    queryKey: ["product-search", debouncedProductTerm, storeId],

    queryFn: async () => {
      const res = await instance.get(
        `/store/search?name=${debouncedProductTerm}&storeId=${storeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    enabled: debouncedProductTerm.length > 0 && storeId !== -1,
    staleTime: 0,
  });

  const { mutate: createClient, isPending: isCreatingClient } = useMutation({
    mutationFn: async (data: ClientInput) => {
      const res = await instance.post("/client", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (res) => {
      showAlert("Cliente creado", "success");
      setSelectedClient(res.data);
    },
    onError: () => {
      showAlert("Error al crear el cliente", "error");
    },
  });

  const { mutate: registerSale, isPending: isRegisteringSale } = useMutation({
    mutationFn: async () => {
      const { total } = calculateTotals();
      const totalPayments = payments.reduce((acc, p) => acc + p.amount, 0);
      const hasTurnedMethod = payments.some((p) => p.turned);

      if (totalPayments > total) {
        if (!hasTurnedMethod) {
          throw new Error(
            "El total de pagos excede el total de la venta y los métodos elegidos no permiten vuelto",
          );
        }
      } else if (Math.abs(total - totalPayments) > 0.01) {
        throw new Error(
          "El total de pagos no coincide con el total de la venta",
        );
      }

      if (!selectedClient) {
        throw new Error("Debe seleccionar un cliente");
      }

      const payload = {
        storeId,
        clientId: selectedClient.clientId,
        typeDocument,
        typeMoney,
        observation,
        saleDetails: items.map((i) => ({
          productId: i.product.productId,
          quantity: i.quantity,
        })),
        saleMethods: payments.map((p) => ({
          methodId: p.payMethodId,
          amount: p.amount,
        })),
      };

      const res = await instance.post("/sale", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (res) => {
      showAlert("Venta registrada con éxito", "success");
      setCreatedSale(res.data);
    },
    onError: (error) => {
      showAlert(error.message || "Error al registrar la venta", "error");
    },
  });

  const resetSale = () => {
    setItems([]);
    setPayments([]);
    setSelectedClient(null);
    setObservation("");
    setCreatedSale(null);
  };

  const addItem = (productStore: ResponseProductStore, quantity: number) => {
    const existingItem = items.find(
      (i) => i.productStoreId === productStore.productStoreId,
    );

    if (
      productStore.actualStock <
      (existingItem ? existingItem.quantity + quantity : quantity)
    ) {
      showAlert("No hay stock suficiente para agregar esa cantidad", "error");
      return;
    }

    if (existingItem) {
      setItems(
        items.map((i) =>
          i.productStoreId === productStore.productStoreId
            ? {
                ...i,
                quantity: i.quantity + quantity,
                total: (i.quantity + quantity) * i.price,
              }
            : i,
        ),
      );
    } else {
      setItems([
        ...items,
        {
          productStoreId: productStore.productStoreId,
          product: productStore.product,
          quantity,
          price: productStore.product.priceSell,
          discount: 0,
          total: quantity * productStore.product.priceSell,
          stock: productStore.actualStock,
        },
      ]);
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.productStoreId !== id));
  };

  const addPayment = (
    payMethodId: number,
    name: string,
    amount: number,
    turned: boolean,
  ) => {
    setPayments([...payments, { payMethodId, name, amount, turned }]);
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const igv = subtotal * 0.18;
    const total = subtotal;
    return { subtotal, igv, total };
  };

  return {
    load: isLoading,
    box: data?.data,
    payMethods: payMethods?.data ?? [],

    // Search
    clients: clients?.data ?? [],
    isSearchingClient,
    setClientTerm,
    clientTerm,
    products: products?.data ?? [],
    isSearchingProduct,
    setProductTerm,
    productTerm,

    // Client
    selectedClient,
    setSelectedClient,
    createClient,
    isCreatingClient,

    // Sale State
    items,
    setItems,
    addItem,
    removeItem,
    payments,
    addPayment,
    removePayment,
    observation,
    setObservation,
    typeMoney,
    setTypeMoney,
    typeDocument,
    setTypeDocument,
    registerSale,
    isRegisteringSale,
    createdSale,
    config: config?.data,
    resetSale,
    ...calculateTotals(),
  };
}
