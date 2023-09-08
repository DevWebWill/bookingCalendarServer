export default function createSlug(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')          // Reemplaza espacios en blanco con guiones
      .replace(/[^\w\-]+/g, '')      // Elimina caracteres no alfanuméricos excepto guiones
      .replace(/\-\-+/g, '-')        // Reemplaza múltiples guiones por uno solo
      .replace(/^-+/, '')            // Elimina guiones al comienzo
      .replace(/-+$/, '');           // Elimina guiones al final
}