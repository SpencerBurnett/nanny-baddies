// Lightweight admin settings persisted client-side until a settings table exists.

export const MODEL_HOUSE_KEY = 'nb_model_house'

const DEFAULT_MODEL_HOUSE = 'Austin, TX — address shared after booking'

export function getModelHouseAddress(): string {
  try {
    return localStorage.getItem(MODEL_HOUSE_KEY) || DEFAULT_MODEL_HOUSE
  } catch {
    return DEFAULT_MODEL_HOUSE
  }
}
