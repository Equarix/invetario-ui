import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/hooks/useAlert";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  ApiResponse,
  ResponseClient,
  ResponseProductStore,
  ResponseProforma,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ClientInput } from "@/schemas/client/client.schema";
import type { ProformaInput } from "@/schemas/proforma/proforma.schema";

export interface ProformaItem {
  productStoreId: number;
  product: ResponseProductStore["product"];
  quantity: number;
  price: number;
  total: number;
  stock: number;
}

export function useCreateProforma() {
  const { token, storeId } = useAuth();
  const { showAlert } = useAlert();

  const [clientTerm, setClientTerm] = useState("");
  const [productTerm, setProductTerm] = useState("");

  const debouncedClientTerm = useDebounce(clientTerm);
  const debouncedProductTerm = useDebounce(productTerm);

  const [selectedClient, setSelectedClient] = useState<ResponseClient | null>(null);
  const [items, setItems] = useState<ProformaItem[]>([]);

  const [createdProforma, setCreatedProforma] = useState<ResponseProforma | null>(null);

  const { data: clients, isFetching: isSearchingClient } = useQuery<ApiResponse<ResponseClient[]>>({
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

  const { data: products, isFetching: isSearchingProduct } = useQuery<ApiResponse<ResponseProductStore[]>>({
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

  const { mutate: registerProforma, isPending: isRegisteringProforma } = useMutation({
    mutationFn: async () => {
      if (!selectedClient) {
        throw new Error("Debe seleccionar un cliente");
      }

      if (items.length === 0) {
        throw new Error("Debe agregar al menos un producto");
      }

      const payload: ProformaInput = {
        storeId,
        clientId: selectedClient.clientId,
        details: items.map((i) => ({
          productId: i.product.productId,
          quantity: i.quantity,
        })),
      };

      const res = await instance.post("/proforma", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (res) => {
      showAlert("Proforma registrada con éxito", "success");
      setCreatedProforma(res.data);
    },
    onError: (error) => {
      showAlert(error.message || "Error al registrar la proforma", "error");
    },
  });

  const resetProforma = () => {
    setItems([]);
    setSelectedClient(null);
    setCreatedProforma(null);
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
          total: quantity * productStore.product.priceSell,
          stock: productStore.actualStock,
        },
      ]);
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.productStoreId !== id));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    // IGV representation logic if needed (usually proformas show total right away or separated depending on local laws)
    const igv = subtotal * 0.18;
    const total = subtotal; // If subtotal already includes IGV in your DB design
    return { subtotal, igv, total };
  };

  return {
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

    // Proforma State
    items,
    setItems,
    addItem,
    removeItem,
    registerProforma,
    isRegisteringProforma,
    createdProforma,
    resetProforma,
    ...calculateTotals(),
  };
}
