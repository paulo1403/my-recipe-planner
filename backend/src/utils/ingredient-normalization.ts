// This file provides utilities for normalizing and converting ingredient quantities and units

// Common unit conversions (to standard units)
interface UnitConversion {
  toStandard: number; // Multiply by this to convert to standard
  standardUnit: string; // The standard unit
}

// Volume conversions (to milliliters)
const volumeConversions: Record<string, UnitConversion> = {
  // Metric
  'ml': { toStandard: 1, standardUnit: 'ml' },
  'milliliter': { toStandard: 1, standardUnit: 'ml' },
  'milliliters': { toStandard: 1, standardUnit: 'ml' },
  'millilitre': { toStandard: 1, standardUnit: 'ml' },
  'millilitres': { toStandard: 1, standardUnit: 'ml' },
  'cl': { toStandard: 10, standardUnit: 'ml' },
  'centiliter': { toStandard: 10, standardUnit: 'ml' },
  'centiliters': { toStandard: 10, standardUnit: 'ml' },
  'dl': { toStandard: 100, standardUnit: 'ml' },
  'deciliter': { toStandard: 100, standardUnit: 'ml' },
  'deciliters': { toStandard: 100, standardUnit: 'ml' },
  'l': { toStandard: 1000, standardUnit: 'ml' },
  'liter': { toStandard: 1000, standardUnit: 'ml' },
  'liters': { toStandard: 1000, standardUnit: 'ml' },
  'litre': { toStandard: 1000, standardUnit: 'ml' },
  'litres': { toStandard: 1000, standardUnit: 'ml' },
  
  // US/Imperial
  'tsp': { toStandard: 4.93, standardUnit: 'ml' },
  'teaspoon': { toStandard: 4.93, standardUnit: 'ml' },
  'teaspoons': { toStandard: 4.93, standardUnit: 'ml' },
  'tbsp': { toStandard: 14.79, standardUnit: 'ml' },
  'tablespoon': { toStandard: 14.79, standardUnit: 'ml' },
  'tablespoons': { toStandard: 14.79, standardUnit: 'ml' },
  'fl oz': { toStandard: 29.57, standardUnit: 'ml' },
  'fluid ounce': { toStandard: 29.57, standardUnit: 'ml' },
  'fluid ounces': { toStandard: 29.57, standardUnit: 'ml' },
  'cup': { toStandard: 236.59, standardUnit: 'ml' },
  'cups': { toStandard: 236.59, standardUnit: 'ml' },
  'pint': { toStandard: 473.18, standardUnit: 'ml' },
  'pints': { toStandard: 473.18, standardUnit: 'ml' },
  'qt': { toStandard: 946.35, standardUnit: 'ml' },
  'quart': { toStandard: 946.35, standardUnit: 'ml' },
  'quarts': { toStandard: 946.35, standardUnit: 'ml' },
  'gal': { toStandard: 3785.41, standardUnit: 'ml' },
  'gallon': { toStandard: 3785.41, standardUnit: 'ml' },
  'gallons': { toStandard: 3785.41, standardUnit: 'ml' },
  
  // Spanish
  'cucharadita': { toStandard: 4.93, standardUnit: 'ml' },
  'cucharaditas': { toStandard: 4.93, standardUnit: 'ml' },
  'cucharada': { toStandard: 14.79, standardUnit: 'ml' },
  'cucharadas': { toStandard: 14.79, standardUnit: 'ml' },
  'taza': { toStandard: 236.59, standardUnit: 'ml' },
  'tazas': { toStandard: 236.59, standardUnit: 'ml' },
};

// Weight conversions (to grams)
const weightConversions: Record<string, UnitConversion> = {
  // Metric
  'mg': { toStandard: 0.001, standardUnit: 'g' },
  'milligram': { toStandard: 0.001, standardUnit: 'g' },
  'milligrams': { toStandard: 0.001, standardUnit: 'g' },
  'g': { toStandard: 1, standardUnit: 'g' },
  'gram': { toStandard: 1, standardUnit: 'g' },
  'grams': { toStandard: 1, standardUnit: 'g' },
  'gramo': { toStandard: 1, standardUnit: 'g' },
  'gramos': { toStandard: 1, standardUnit: 'g' },
  'kg': { toStandard: 1000, standardUnit: 'g' },
  'kilogram': { toStandard: 1000, standardUnit: 'g' },
  'kilograms': { toStandard: 1000, standardUnit: 'g' },
  'kilo': { toStandard: 1000, standardUnit: 'g' },
  'kilos': { toStandard: 1000, standardUnit: 'g' },
  
  // US/Imperial
  'oz': { toStandard: 28.35, standardUnit: 'g' },
  'ounce': { toStandard: 28.35, standardUnit: 'g' },
  'ounces': { toStandard: 28.35, standardUnit: 'g' },
  'onza': { toStandard: 28.35, standardUnit: 'g' },
  'onzas': { toStandard: 28.35, standardUnit: 'g' },
  'lb': { toStandard: 453.59, standardUnit: 'g' },
  'pound': { toStandard: 453.59, standardUnit: 'g' },
  'pounds': { toStandard: 453.59, standardUnit: 'g' },
  'libra': { toStandard: 453.59, standardUnit: 'g' },
  'libras': { toStandard: 453.59, standardUnit: 'g' },
};

// Count units (non-convertible)
const countUnits = [
  'unit', 'units', 'piece', 'pieces', 'item', 'items', 'whole', 'unidad', 'unidades',
  'slice', 'slices', 'rebanada', 'rebanadas', 'bunch', 'bunches', 'manojo', 'manojos',
  'pinch', 'pinches', 'pizca', 'pizcas', 'clove', 'cloves', 'diente', 'dientes',
  'sprig', 'sprigs', 'rama', 'ramas', 'leaf', 'leaves', 'hoja', 'hojas',
];

/**
 * Determines the unit type for a given unit
 * @param unit The unit to check
 * @returns 'volume', 'weight', 'count', or 'unknown'
 */
function getUnitType(unit: string): 'volume' | 'weight' | 'count' | 'unknown' {
  const normalizedUnit = unit.toLowerCase().trim();
  
  if (volumeConversions[normalizedUnit]) {
    return 'volume';
  }
  
  if (weightConversions[normalizedUnit]) {
    return 'weight';
  }
  
  if (countUnits.includes(normalizedUnit)) {
    return 'count';
  }
  
  return 'unknown';
}

interface NormalizedIngredient {
  name: string;
  quantity: number;
  unit: string;
  standardQuantity?: number; // Quantity in standard units
  standardUnit?: string;     // Standard unit
  notes?: string;
}

/**
 * Normalizes an ingredient by converting its quantity to a standard unit
 * @param ingredient The ingredient to normalize
 * @returns The normalized ingredient with standard units and quantities
 */
export function normalizeIngredient(ingredient: {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}): NormalizedIngredient {
  const result: NormalizedIngredient = {
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
  };
  
  if (ingredient.notes) {
    result.notes = ingredient.notes;
  }
  
  const unit = ingredient.unit.toLowerCase().trim();
  const unitType = getUnitType(unit);
  
  if (unitType === 'volume' && volumeConversions[unit]) {
    const conversion = volumeConversions[unit];
    result.standardQuantity = ingredient.quantity * conversion.toStandard;
    result.standardUnit = conversion.standardUnit;
  } else if (unitType === 'weight' && weightConversions[unit]) {
    const conversion = weightConversions[unit];
    result.standardQuantity = ingredient.quantity * conversion.toStandard;
    result.standardUnit = conversion.standardUnit;
  }
  
  return result;
}

/**
 * Combines two ingredients if they have the same name and compatible units
 * @param a First ingredient
 * @param b Second ingredient
 * @returns Combined ingredient or null if they cannot be combined
 */
export function combineIngredients(
  a: NormalizedIngredient,
  b: NormalizedIngredient
): NormalizedIngredient | null {
  // If names don't match, can't combine
  if (a.name.toLowerCase() !== b.name.toLowerCase()) {
    return null;
  }
  
  // If units are the same, direct combination
  if (a.unit.toLowerCase() === b.unit.toLowerCase()) {
    return {
      name: a.name,
      quantity: a.quantity + b.quantity,
      unit: a.unit,
      notes: combineNotes(a.notes, b.notes),
      ...(a.standardQuantity && b.standardQuantity ? {
        standardQuantity: a.standardQuantity + b.standardQuantity,
        standardUnit: a.standardUnit
      } : {})
    };
  }
  
  // If both have standard quantities, combine using those
  if (a.standardQuantity !== undefined && b.standardQuantity !== undefined && 
      a.standardUnit === b.standardUnit) {
    // Choose the unit from the larger quantity as the display unit
    const totalStandardQuantity = a.standardQuantity + b.standardQuantity;
    let displayUnit: string;
    let displayQuantity: number;
    
    // Convert back to the most appropriate unit
    if (a.standardQuantity > b.standardQuantity) {
      displayUnit = a.unit;
      displayQuantity = convertFromStandard(totalStandardQuantity, a.standardUnit!, a.unit);
    } else {
      displayUnit = b.unit;
      displayQuantity = convertFromStandard(totalStandardQuantity, b.standardUnit!, b.unit);
    }
    
    return {
      name: a.name,
      quantity: displayQuantity,
      unit: displayUnit,
      standardQuantity: totalStandardQuantity,
      standardUnit: a.standardUnit,
      notes: combineNotes(a.notes, b.notes)
    };
  }
  
  // Cannot combine with current logic
  return null;
}

/**
 * Combines notes from two ingredients
 * @param notesA Notes from the first ingredient
 * @param notesB Notes from the second ingredient
 * @returns Combined notes or undefined if both are undefined
 */
function combineNotes(notesA?: string, notesB?: string): string | undefined {
  if (!notesA && !notesB) {
    return undefined;
  }
  
  if (!notesA) {
    return notesB;
  }
  
  if (!notesB) {
    return notesA;
  }
  
  if (notesA === notesB) {
    return notesA;
  }
  
  return `${notesA}; ${notesB}`;
}

/**
 * Converts a quantity from standard units back to a specified unit
 * @param quantity Quantity in standard units
 * @param standardUnit The standard unit (ml or g)
 * @param targetUnit The target unit to convert to
 * @returns Quantity in the target unit
 */
function convertFromStandard(quantity: number, standardUnit: string, targetUnit: string): number {
  const normalizedTargetUnit = targetUnit.toLowerCase().trim();
  
  if (standardUnit === 'ml' && volumeConversions[normalizedTargetUnit]) {
    return quantity / volumeConversions[normalizedTargetUnit].toStandard;
  }
  
  if (standardUnit === 'g' && weightConversions[normalizedTargetUnit]) {
    return quantity / weightConversions[normalizedTargetUnit].toStandard;
  }
  
  // If no conversion found, return the original quantity
  return quantity;
}

/**
 * Consolidates a list of ingredients by combining those that can be combined
 * @param ingredients List of ingredients to consolidate
 * @returns Consolidated list of ingredients
 */
export function consolidateIngredients(ingredients: Array<{
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}>): NormalizedIngredient[] {
  // First normalize all ingredients
  const normalizedIngredients = ingredients.map(normalizeIngredient);
  
  // Use a map to group ingredients by name and unit type
  const consolidatedMap = new Map<string, NormalizedIngredient>();
  
  normalizedIngredients.forEach(ing => {
    const unitType = getUnitType(ing.unit);
    // Create a key based on name and unit type
    const key = `${ing.name.toLowerCase()}|${unitType}`;
    
    if (consolidatedMap.has(key)) {
      const existing = consolidatedMap.get(key)!;
      const combined = combineIngredients(existing, ing);
      
      if (combined) {
        consolidatedMap.set(key, combined);
      } else {
        // If can't combine, just add with a modified key
        consolidatedMap.set(`${key}|${consolidatedMap.size}`, ing);
      }
    } else {
      consolidatedMap.set(key, ing);
    }
  });
  
  return Array.from(consolidatedMap.values());
}

// Format quantity for display
export function formatQuantity(quantity: number): string {
  // Handle whole numbers
  if (Number.isInteger(quantity)) {
    return quantity.toString();
  }
  
  // Handle common fractions
  const fraction = quantity - Math.floor(quantity);
  const whole = Math.floor(quantity);
  
  if (Math.abs(fraction - 0.25) < 0.01) {
    return whole > 0 ? `${whole} 1/4` : '1/4';
  } else if (Math.abs(fraction - 0.5) < 0.01) {
    return whole > 0 ? `${whole} 1/2` : '1/2';
  } else if (Math.abs(fraction - 0.75) < 0.01) {
    return whole > 0 ? `${whole} 3/4` : '3/4';
  } else if (Math.abs(fraction - 0.33) < 0.01) {
    return whole > 0 ? `${whole} 1/3` : '1/3';
  } else if (Math.abs(fraction - 0.67) < 0.01) {
    return whole > 0 ? `${whole} 2/3` : '2/3';
  }
  
  // Round to 2 decimal places for other values
  return quantity.toFixed(2).replace(/\.00$/, '');
}

/**
 * Formats an ingredient for display
 * @param ingredient The normalized ingredient
 * @returns Ingredient with formatted quantity
 */
export function formatIngredient(ingredient: NormalizedIngredient): {
  name: string;
  quantity: string;
  unit: string;
  notes?: string;
} {
  return {
    name: ingredient.name,
    quantity: formatQuantity(ingredient.quantity),
    unit: ingredient.unit,
    notes: ingredient.notes
  };
}
