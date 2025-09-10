const conversions = {
  // De masa a masa
  gramos: { kilogramos: (g) => g / 1000 },
  kilogramos: { gramos: (kg) => kg * 1000 },

  // De volumen a volumen
  mililitros: { litros: (ml) => ml / 1000 },
  litros: { mililitros: (l) => l * 1000 },

  // Unidades discretas (no se convierten)
  unidades: {},
  cucharadas: {},
  cucharaditas: {},
  tazas: {},
  pza: {}
};

// Función para convertir una cantidad de una unidad a otra
const convertUnit = (quantity, fromUnit, toUnit) => {
  if (fromUnit === toUnit) {
    return quantity;
  }
  if (conversions[fromUnit] && conversions[fromUnit][toUnit]) {
    return conversions[fromUnit][toUnit](quantity);
  }
  // Si no hay una conversión directa, no se puede convertir.
  // En un futuro, podríamos añadir conversiones más complejas aquí (ej. tazas a gramos, que depende del ingrediente)
  throw new Error(`No se puede convertir de ${fromUnit} a ${toUnit}`);
};

// Función para 'embellecer' la unidad final
const formatQuantity = (quantity, unit) => {
  switch (unit) {
    case 'g':
      if (quantity >= 1000) {
        return { quantity: quantity / 1000, unit: 'kilogramos' };
      }
      break;
    case 'mililitros':
      if (quantity >= 1000) {
        return { quantity: quantity / 1000, unit: 'litros' };
      }
      break;
    default:
      break;
  }
  return { quantity, unit };
};

module.exports = { convertUnit, formatQuantity };
