export function numberToWords(n: number): string {
  if (n === 0) return "CERO";

  const units = [
    "",
    "UN",
    "DOS",
    "TRES",
    "CUATRO",
    "CINCO",
    "SEIS",
    "SIETE",
    "OCHO",
    "NUEVE",
  ];
  const tens = [
    "",
    "DIEZ",
    "VEINTE",
    "TREINTA",
    "CUARENTA",
    "CINCUENTA",
    "SESENTA",
    "SETENTA",
    "OCHENTA",
    "NOVENTA",
  ];
  const teens = [
    "DIEZ",
    "ONCE",
    "DOCE",
    "TRECE",
    "CATORCE",
    "QUINCE",
    "DIECISEIS",
    "DIECISIETE",
    "DIECIOCHO",
    "DIECINUEVE",
  ];
  const hundreds = [
    "",
    "CIENTO",
    "DOSCIENTOS",
    "TRESCIENTOS",
    "CUATROCIENTOS",
    "QUINIENTOS",
    "SEISCIENTOS",
    "SETENCIENTOS",
    "OCHOCIENTOS",
    "NOVECIENTOS",
  ];

  function convert(n: number): string {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      if (n === 20) return "VEINTE";
      const u = n % 10;
      return tens[Math.floor(n / 10)] + (u > 0 ? " Y " + units[u] : "");
    }
    if (n < 1000) {
      if (n === 100) return "CIEN";
      const h = Math.floor(n / 100);
      const r = n % 100;
      return hundreds[h] + (r > 0 ? " " + convert(r) : "");
    }
    if (n < 1000000) {
      const m = Math.floor(n / 1000);
      const r = n % 1000;
      let text = "";
      if (m === 1) text = "MIL";
      else text = convert(m) + " MIL";
      return text + (r > 0 ? " " + convert(r) : "");
    }
    return "";
  }

  const integerPart = Math.floor(n);
  const decimalPart = Math.round((n - integerPart) * 100);

  const integerText = convert(integerPart);
  const decimalText = decimalPart.toString().padStart(2, "0") + "/100";

  return `${integerText} CON ${decimalText}`.toUpperCase();
}
