export type TextSize = 'normal' | 'large'

export const TEXT_SIZES: TextSize[] = ['normal', 'large']

export const TEXT_SIZE_KEY = 'francebasics.textSize'

export function parseTextSize(value: string | null): TextSize | null {
  return TEXT_SIZES.find((size) => size === value) ?? null
}

export function loadTextSize(): TextSize {
  try {
    return parseTextSize(localStorage.getItem(TEXT_SIZE_KEY)) ?? 'normal'
  } catch {
    return 'normal'
  }
}

export function saveTextSize(size: TextSize): void {
  try {
    localStorage.setItem(TEXT_SIZE_KEY, size)
  } catch {
    // the choice then only lasts until the app is closed
  }
}

export function applyTextSize(size: TextSize): void {
  document.documentElement.dataset.textSize = size
}
