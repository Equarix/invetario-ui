import type { ResponseConfig, ResponseProforma } from "@/interface/response.interface";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { numberToWords } from "@/utils/numberToWords";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#333" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  logoContainer: { width: "50%" },
  logo: { width: 120, height: 50, objectFit: "contain", marginBottom: 5 },
  enterpriseName: { fontSize: 14, fontWeight: "bold", color: "#000" },
  textSm: { fontSize: 9, color: "#666", marginBottom: 2 },
  titleBox: { alignItems: "center", border: "1 solid #ccc", padding: 10, borderRadius: 5, width: "40%", backgroundColor: "#f9fafb" },
  title: { fontSize: 16, fontWeight: "bold", letterSpacing: 1, marginBottom: 5 },
  proformaNumber: { fontSize: 14, fontWeight: "bold", color: "#db2777" },
  infoSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, borderTop: "1 solid #eee", paddingTop: 10 },
  infoBlock: { width: "48%" },
  infoRow: { flexDirection: "row", marginBottom: 3 },
  infoLabel: { width: 70, fontWeight: "bold", fontSize: 9 },
  infoValue: { flex: 1, fontSize: 9 },
  table: { width: "100%", marginBottom: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f3f4f6", borderBottom: "1 solid #ccc", paddingVertical: 5 },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #eee", paddingVertical: 5 },
  colItem: { width: "45%", paddingHorizontal: 5 },
  colCode: { width: "15%", paddingHorizontal: 5 },
  colQty: { width: "10%", paddingHorizontal: 5, textAlign: "center" },
  colPrice: { width: "15%", paddingHorizontal: 5, textAlign: "right" },
  colTotal: { width: "15%", paddingHorizontal: 5, textAlign: "right" },
  tableHeaderCell: { fontSize: 9, fontWeight: "bold" },
  tableCell: { fontSize: 9 },
  totalSection: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  totalBox: { width: "50%", borderTop: "1 solid #ccc", paddingTop: 5 },
  totalRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 3 },
  totalLabel: { fontSize: 10, fontWeight: "bold", width: "45%" },
  totalValue: { fontSize: 12, fontWeight: "bold", color: "#000", flex: 1, textAlign: "right" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, textAlign: "center", borderTop: "1 solid #ccc", paddingTop: 10 },
  footerText: { fontSize: 8, color: "#999", marginBottom: 2 },
});

interface ProformaPdfDocumentProps {
  proforma: ResponseProforma;
  config: ResponseConfig;
}

export default function ProformaPdfDocument({ proforma, config }: ProformaPdfDocumentProps) {
  const total = proforma.details.reduce((acc, detail) => acc + detail.price * detail.quantity, 0);

  // Safety check since config backend might have mapped address into localCurrency
  const isCurrencyValid = config.localCurrency && config.localCurrency.length <= 8;
  const currencyLabel = isCurrencyValid ? config.localCurrency : "SOLES";
  const currencySymbol = isCurrencyValid ? config.localCurrency : "S/";
  const currencyWords = (config.localCurrency === "USD" || config.localCurrency === "DOLARES") ? "DOLARES" : "SOLES";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {config.logoUrl && <Image src={config.logoUrl} style={styles.logo} />}
            <Text style={styles.enterpriseName}>{config.enterpriseName.toUpperCase()}</Text>
            <Text style={styles.textSm}>{config.address}</Text>
            <Text style={styles.textSm}>Tel: {config.phone}</Text>
            <Text style={styles.textSm}>{config.contactEmail}</Text>
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.textSm}>R.U.C. {config.ruc}</Text>
            <Text style={styles.title}>PROFORMA</Text>
            <Text style={styles.proformaNumber}>N° {proforma.proformaId.toString().padStart(8, "0")}</Text>
          </View>
        </View>

        {/* Client and Document Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CLIENTE:</Text>
              <Text style={styles.infoValue}>{proforma.client.name.toUpperCase()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{proforma.client.typeDocument}:</Text>
              <Text style={styles.infoValue}>{proforma.client.documentNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>DIRECCIÓN:</Text>
              <Text style={styles.infoValue}>{proforma.client.email || "No especificada"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TELÉFONO:</Text>
              <Text style={styles.infoValue}>{proforma.client.phone}</Text>
            </View>
          </View>
          
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>FECHA:</Text>
              <Text style={styles.infoValue}>{new Date(proforma.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>MONEDA:</Text>
              <Text style={styles.infoValue}>{currencyLabel}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ALMACÉN:</Text>
              <Text style={styles.infoValue}>{proforma.store.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ASESOR:</Text>
              <Text style={styles.infoValue}>{proforma.user.firstName} {proforma.user.lastName}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colItem}><Text style={styles.tableHeaderCell}>DESCRIPCIÓN</Text></View>
            <View style={styles.colCode}><Text style={styles.tableHeaderCell}>CÓDIGO</Text></View>
            <View style={styles.colQty}><Text style={styles.tableHeaderCell}>CANT.</Text></View>
            <View style={styles.colPrice}><Text style={styles.tableHeaderCell}>P. UNIT.</Text></View>
            <View style={styles.colTotal}><Text style={styles.tableHeaderCell}>SUBTOTAL</Text></View>
          </View>
          
          {proforma.details.map((detail) => (
            <View style={styles.tableRow} key={detail.proformaDetailsId}>
              <View style={styles.colItem}><Text style={styles.tableCell}>{detail.productName}</Text></View>
              <View style={styles.colCode}><Text style={styles.tableCell}>{detail.product.code}</Text></View>
              <View style={styles.colQty}><Text style={styles.tableCell}>{detail.quantity}</Text></View>
              <View style={styles.colPrice}><Text style={styles.tableCell}>{detail.price.toFixed(2)}</Text></View>
              <View style={styles.colTotal}><Text style={styles.tableCell}>{(detail.price * detail.quantity).toFixed(2)}</Text></View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL ESTIMADO:</Text>
              <Text style={styles.totalValue}>{currencySymbol} {total.toFixed(2)}</Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={{ fontSize: 8, fontStyle: "italic", color: "#666", textAlign: "right" }}>
                SON: {numberToWords(total).toUpperCase()} {currencyWords}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Esta proforma tiene una validez de 15 días a partir de su fecha de emisión.</Text>
          <Text style={styles.footerText}>Si tiene alguna duda, comuníquese con nosotros al {config.phone}.</Text>
          <Text style={styles.footerText}>¡Gracias por su preferencia!</Text>
        </View>
      </Page>
    </Document>
  );
}
