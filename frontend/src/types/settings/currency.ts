export enum Currency {
  USD = 'USD',
  KRW = 'KRW',
  JPY = 'JPY'
}

export type CurrencyProperties = {
  decimals: number,
  symbol: string
}

export const currencyPropertiesMap: Record<Currency, CurrencyProperties> = {
  [Currency.USD]: {
    decimals: 2,
    symbol: '$'
  },
  [Currency.KRW]: {
    decimals: 0,
    symbol: '₩'
  },
  [Currency.JPY]: {
    decimals: 0,
    symbol: '¥'
  }
}