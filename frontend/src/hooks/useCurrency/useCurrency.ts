import * as React from 'react';
import { SettingsContext } from '../../app/contexts/settings/SettingsContext';
import { Currency, CurrencyProperties, currencyPropertiesMap } from '../../types/settings/currency';

export function useCurrency(): { properties: CurrencyProperties, toDatabaseAmount: (value: number | null | undefined) => number, getActualAmount: (value: number | null | undefined) => number } {
  const { settings } = React.useContext(SettingsContext);
  const currency: Currency = settings?.general.currency ?? Currency.KRW;

  const properties = currencyPropertiesMap[currency];

  const getActualAmount = (value: number | null | undefined) => {
    return (value ?? 0) / Math.pow(10, properties.decimals);
  }

  const toDatabaseAmount = (value: number | null | undefined) => {
    return (value ?? 0) * Math.pow(10, properties.decimals);
  }

  return { properties, getActualAmount, toDatabaseAmount }
}