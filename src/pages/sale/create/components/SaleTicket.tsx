import type {
  ResponseConfig,
  ResponseSale,
} from "@/interface/response.interface";
import { numberToWords } from "@/utils/numberToWords";

interface SaleTicketProps {
  sale: ResponseSale;
  config: ResponseConfig;
}

export default function SaleTicket({ sale, config }: SaleTicketProps) {
  const totalPaid = sale.saleMethods.reduce((acc, m) => acc + m.amount, 0);
  const hasTurnedMethod = sale.saleMethods.some((m) => m.paymethod.turned);
  const vuelto = hasTurnedMethod ? Math.max(0, totalPaid - sale.total) : 0;
  const impRecibido = hasTurnedMethod ? totalPaid : sale.total;

  return (
    <div
      id="sale-ticket"
      className="w-[80mm] bg-white p-4 font-mono text-[10px] text-black leading-tight mx-auto border border-zinc-200"
    >
      {/* Header */}
      <div className="text-center mb-4 flex flex-col items-center gap-1">
        {config.logoUrl && (
          <img src={config.logoUrl} alt="Logo" className="w-32 h-auto mb-2" />
        )}
        <h1 className="font-bold text-sm uppercase">{config.enterpriseName}</h1>
        <p>RUC: {config.ruc}</p>
        <p>Sucursal: {sale.store.name}</p>
        <p className="text-center">{config.address}</p>
        <p>{config.localCurrency}</p>
        <p>Teléfono: {config.phone}</p>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      {/* Payment Summary Header */}
      <div className="mb-2">
        <p className="font-bold">COND. PAGO:</p>
        {sale.saleMethods.map((m) => (
          <div key={m.saleMethodId} className="flex justify-between">
            <span>{m.paymethod.name}</span>
            <span>{m.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      {/* Sale Info */}
      <div className="mb-2 space-y-1">
        <p className="font-bold">
          {sale.typeDocument} ELECTRÓNICA:{" "}
          {sale.saleId.toString().padStart(8, "0")}
        </p>
        <p>CLIENTE: {sale.client.name.toUpperCase()}</p>
        <p>
          {sale.client.typeDocument}: {sale.client.documentNumber}
        </p>
        <p>DIRECCIÓN: {sale.client.email || "CIUDAD"}</p>
        <p>F. EMISIÓN: {new Date(sale.createdAt).toLocaleString()}</p>
        <p>MONEDA: {sale.typeMoney === "SOL" ? "SOLES" : "DOLARES"}</p>
        <p>VENDEDOR: {sale.user.firstName.toUpperCase()}</p>
        <p>
          IMP. RECIBIDO: {impRecibido.toFixed(2)} | VUELTO: {vuelto.toFixed(2)}
        </p>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      {/* Details */}
      <div className="mb-2">
        {sale.saleDetails.map((d) => (
          <div key={d.saleDetailId} className="mb-2">
            <p>
              {d.quantity} {d.product.name.toUpperCase()} -{" "}
              {d.product.description || ""}
            </p>
            <div className="flex justify-end gap-4">
              <span>UNIDAD {d.priceSell.toFixed(2)}</span>
              <span>{(d.quantity * d.priceSell).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      {/* Totals */}
      <div className="flex justify-end gap-4 font-bold text-xs mb-4">
        <span>TOTAL:</span>
        <span>{sale.total.toFixed(2)}</span>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      {/* Footer */}
      <div className="text-center space-y-2 mt-4">
        <p className="font-bold">
          SON: {numberToWords(sale.total)}{" "}
          {sale.typeMoney === "SOL" ? "SOLES" : "DOLARES"}
        </p>
        <p className="mt-4 italic">LA CALIDAD NO ES UNA CASUALIDAD</p>
        <p>{config.enterpriseName} Calidad a su Servicio</p>
        <div className="border-t border-double border-black my-2 py-1">
          <p className="font-bold">Emitido por: OFICINA</p>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #sale-ticket, #sale-ticket * {
            visibility: visible;
          }
          #sale-ticket {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
            border: none;
            width: 80mm;
          }
        }
      `}</style>
    </div>
  );
}
