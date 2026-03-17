import type { ResponseConfig, ResponseProforma } from "@/interface/response.interface";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import ProformaPdfDocument from "./ProformaPdfDocument";
import { Button } from "@heroui/react";
import { MdDownload, MdPrint } from "react-icons/md";

interface ProformaPdfButtonsProps {
  proforma: ResponseProforma;
  config: ResponseConfig;
}

export default function ProformaPdfButtons({ proforma, config }: ProformaPdfButtonsProps) {
  const handlePrint = (url: string) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  return (
    <div className="flex gap-4 w-full mt-6">
      <PDFDownloadLink
        className="flex-1"
        document={<ProformaPdfDocument proforma={proforma} config={config} />}
        fileName={`proforma-${proforma.proformaId.toString().padStart(8, "0")}.pdf`}
      >
        {({ loading }) => (
          <Button
            color="primary"
            variant="flat"
            isLoading={loading}
            className="w-full h-12 font-bold"
            startContent={<MdDownload className="text-xl" />}
          >
            {loading ? "Generando..." : "DESCARGAR PDF"}
          </Button>
        )}
      </PDFDownloadLink>

      <BlobProvider document={<ProformaPdfDocument proforma={proforma} config={config} />}>
        {({ url, loading }) => (
          <Button
            color="secondary"
            variant="solid"
            isLoading={loading}
            className="flex-1 h-12 font-bold"
            onPress={() => url && handlePrint(url)}
            startContent={<MdPrint className="text-xl" />}
          >
            {loading ? "Generando..." : "IMPRIMIR"}
          </Button>
        )}
      </BlobProvider>
    </div>
  );
}
