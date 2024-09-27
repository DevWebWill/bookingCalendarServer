export function createSlug(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')          // Reemplaza espacios en blanco con guiones
      .replace(/[^\w\-]+/g, '')      // Elimina caracteres no alfanuméricos excepto guiones
      .replace(/\-\-+/g, '-')        // Reemplaza múltiples guiones por uno solo
      .replace(/^-+/, '')            // Elimina guiones al comienzo
      .replace(/-+$/, '');           // Elimina guiones al final
}

export function formatDateToDDMMYYYY(date) { // new Date -> dd/mm/YYYY
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
}

export function parseDDMMYYYYToDate(dateString) { // dd/mm/YYYY -> new Date
  const [day, month, year] = dateString.split('/').map(Number); // Divide la fecha y convierte los componentes a números
  return new Date(year, month - 1, day); // Date usa meses base 0, por eso restamos 1
};