import { useAuth } from "@/context/AuthContext";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Select,
  SelectItem,
  Textarea,
  addToast,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import {
  LuBox,
  LuCalendar,
  LuCircleCheck,
  LuLock,
  LuSearch,
  LuStore,
} from "react-icons/lu";
import { useDayBox } from "./hooks/useDayBox";

export default function BoxSummaryPage() {
  const { user, storeId, boxId } = useAuth();

  // Date formatted as YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Filter form states
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Initialize store ID from context or user stores
  const initialStoreId = useMemo(() => {
    if (storeId && storeId !== -1) return storeId;
    return user?.stores?.[0]?.storeId || -1;
  }, [storeId, user?.stores]);

  const [selectedStoreId, setSelectedStoreId] =
    useState<number>(initialStoreId);

  // Available boxes based on selected store
  const availableBoxes = useMemo(() => {
    if (!user?.boxes) return [];
    return user.boxes.filter((b) => b.storeId === Number(selectedStoreId));
  }, [user?.boxes, selectedStoreId]);

  // Initialize box ID
  const initialBoxId = useMemo(() => {
    if (boxId && boxId !== -1) {
      const match = availableBoxes.find((b) => b.boxId === boxId);
      if (match) return boxId;
    }
    return availableBoxes[0]?.boxId || -1;
  }, [boxId, availableBoxes]);

  const [selectedBoxId, setSelectedBoxId] = useState<number>(initialBoxId);

  // Active query parameters (triggered on Visualizar search)
  const [queryDate, setQueryDate] = useState<string>(todayStr);
  const [queryBoxId, setQueryBoxId] = useState<number>(initialBoxId);

  // Sync selectedBoxId when store changes if current box does not belong to store
  useEffect(() => {
    if (availableBoxes.length > 0) {
      const currentValid = availableBoxes.some(
        (b) => b.boxId === selectedBoxId,
      );
      if (!currentValid) {
        setSelectedBoxId(availableBoxes[0].boxId);
      }
    } else {
      setSelectedBoxId(-1);
    }
  }, [selectedStoreId, availableBoxes, selectedBoxId]);

  // Fetch DayBox data
  const { dayBox, isLoading, createDayBox, isCreating } = useDayBox(
    queryDate,
    queryBoxId,
  );

  // Form input states
  const [totalEfectivo, setTotalEfectivo] = useState<string>("0");
  const [totalTarjeta, setTotalTarjeta] = useState<string>("0");
  const [observations, setObservations] = useState<string>("");

  const isAlreadyCreated = Boolean(dayBox);

  // When dayBox query returns data, sync form values
  useEffect(() => {
    if (dayBox) {
      const efecVal = dayBox.totalefectivo ?? dayBox.totalEfectivo ?? 0;
      setTotalEfectivo(efecVal.toString());
      setTotalTarjeta(dayBox.totalTarjeta?.toString() || "0");
      setObservations(dayBox.observations || "");
    } else {
      setTotalEfectivo("0");
      setTotalTarjeta("0");
      setObservations("");
    }
  }, [dayBox]);

  // Trigger Search
  const handleSearch = () => {
    if (!selectedDate) {
      addToast({
        title: "Seleccione una fecha",
        description: "Debe seleccionar una fecha para visualizar el resumen.",
        color: "warning",
      });
      return;
    }
    if (selectedBoxId === -1) {
      addToast({
        title: "Seleccione una caja",
        description: "Debe seleccionar una caja válida.",
        color: "warning",
      });
      return;
    }
    setQueryDate(selectedDate);
    setQueryBoxId(selectedBoxId);
  };

  // Calculated total user closure amount
  const montoCierre = useMemo(() => {
    const efec = parseFloat(totalEfectivo) || 0;
    const tarj = parseFloat(totalTarjeta) || 0;
    return efec + tarj;
  }, [totalEfectivo, totalTarjeta]);

  // Handle submit DayBox
  const handleSubmit = async () => {
    if (isAlreadyCreated) {
      addToast({
        title: "Resumen ya registrado",
        description:
          "No se puede crear un nuevo resumen porque ya existe uno para esta fecha y caja.",
        color: "warning",
      });
      return;
    }

    if (queryBoxId === -1) {
      addToast({
        title: "Caja no seleccionada",
        description: "Por favor seleccione una caja válida.",
        color: "danger",
      });
      return;
    }

    try {
      await createDayBox({
        date: queryDate,
        boxId: queryBoxId,
        observations: observations.trim(),
        totalTarjeta: parseFloat(totalTarjeta) || 0,
        totalEfectivo: parseFloat(totalEfectivo) || 0,
      });
    } catch {
      // Handled in mutation onError
    }
  };

  const selectedStoreName =
    user?.stores?.find((s) => s.storeId === Number(selectedStoreId))?.name ||
    "";
  const selectedBoxName =
    availableBoxes.find((b) => b.boxId === Number(selectedBoxId))?.boxName ||
    "";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <LuBox className="text-primary" />
            Resumen de Caja
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Consulta y registro del cierre diario de caja por sucursal.
          </p>
        </div>
      </div>

      {/* FILTROS DE BUSQUEDA */}
      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <LuSearch size={16} />
            Filtros de Búsqueda
          </h2>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Input
              type="date"
              label="Fecha"
              labelPlacement="outside"
              placeholder="Seleccionar fecha"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              startContent={<LuCalendar className="text-zinc-400" />}
              className="w-full"
            />

            <Select
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Seleccionar sucursal"
              selectedKeys={
                selectedStoreId !== -1 ? [selectedStoreId.toString()] : []
              }
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val) setSelectedStoreId(val);
              }}
              startContent={<LuStore className="text-zinc-400" />}
              className="w-full"
            >
              {(user?.stores || []).map((store) => (
                <SelectItem key={store.storeId.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Caja"
              labelPlacement="outside"
              placeholder="Seleccionar caja"
              selectedKeys={
                selectedBoxId !== -1 ? [selectedBoxId.toString()] : []
              }
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val) setSelectedBoxId(val);
              }}
              startContent={<LuBox className="text-zinc-400" />}
              className="w-full"
            >
              {availableBoxes.map((box) => (
                <SelectItem key={box.boxId.toString()}>
                  {box.boxName}
                </SelectItem>
              ))}
            </Select>

            <Button
              color="primary"
              className="w-full font-semibold shadow-md shadow-primary/20"
              onPress={handleSearch}
              isLoading={isLoading}
              startContent={!isLoading && <LuSearch size={18} />}
            >
              Visualizar
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* CERRAR CAJA SECTION */}
      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Cerrar Caja:
            </h2>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
              {selectedStoreName} - {selectedBoxName} ({queryDate})
            </span>
          </div>

          {isAlreadyCreated ? (
            <Chip
              color="success"
              variant="flat"
              startContent={<LuCircleCheck size={16} />}
              className="font-semibold text-xs"
            >
              Resumen Registrado / Caja Cerrada
            </Chip>
          ) : (
            <Chip
              color="warning"
              variant="flat"
              startContent={<LuLock size={16} />}
              className="font-semibold text-xs"
            >
              Pendiente de Cierre
            </Chip>
          )}
        </CardHeader>

        <CardBody className="p-6 space-y-6">
          {/* Warning Banner if already created */}
          {isAlreadyCreated && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm flex items-center gap-3 font-medium">
              <LuLock size={20} className="shrink-0" />
              <span>
                Ya existe un resumen de caja registrado para esta fecha y caja.
                No se puede volver a crear un resumen.
              </span>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Id Cierre */}
            <Input
              label="Id Cierre"
              labelPlacement="outside"
              placeholder="N/A"
              value={
                dayBox?.dayBoxId?.toString() ||
                dayBox?.idCierre?.toString() ||
                "-"
              }
              isReadOnly
              className="w-full"
            />

            {/* Efectivo en caja */}
            <Input
              type="number"
              step="0.01"
              label="Efectivo en caja"
              labelPlacement="outside"
              placeholder="0.00"
              value={totalEfectivo}
              onValueChange={setTotalEfectivo}
              isDisabled={isAlreadyCreated || isCreating}
              className="w-full"
            />

            {/* POS + TRANSFERENCIA + DEPOSITO */}
            <Input
              type="number"
              step="0.01"
              label="POS + TRANSFERENCIA + DEPOSITO"
              labelPlacement="outside"
              placeholder="0.00"
              value={totalTarjeta}
              onValueChange={setTotalTarjeta}
              isDisabled={isAlreadyCreated || isCreating}
              className="w-full"
            />

            {/* Efectivo Sistema */}
            <Input
              label="Efectivo Sistema"
              labelPlacement="outside"
              placeholder="0.00"
              value="0.00"
              isReadOnly
              className="w-full"
            />

            {/* POS + TRANSFERENCIA + DEPOSITO Sistema */}
            <Input
              label="POS + TRANSFERENCIA + DEPOSITO Sistema"
              labelPlacement="outside"
              placeholder="0.00"
              value="0.00"
              isReadOnly
              className="w-full"
            />

            {/* Fecha */}
            <Input
              label="Fecha"
              labelPlacement="outside"
              value={queryDate}
              isReadOnly
              className="w-full"
            />

            {/* Monto Cierre */}
            <Input
              label="Monto Cierre"
              labelPlacement="outside"
              value={montoCierre.toFixed(2)}
              isReadOnly
              className="w-full font-bold text-primary"
            />
          </div>

          {/* Observaciones */}
          <div className="w-full">
            <Textarea
              label="Observaciones"
              labelPlacement="outside"
              placeholder="Ingrese observaciones sobre el cierre de caja..."
              value={observations}
              onValueChange={setObservations}
              isDisabled={isAlreadyCreated || isCreating}
              minRows={2}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
            <Button
              color="primary"
              size="lg"
              className="font-bold px-8 shadow-lg shadow-primary/25 w-full sm:w-auto"
              isDisabled={isAlreadyCreated || isCreating}
              isLoading={isCreating}
              onPress={handleSubmit}
              startContent={
                !isCreating && <LuLock size={18} className="shrink-0" />
              }
            >
              CERRAR & BLOQUEAR DOCUMENTOS
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
