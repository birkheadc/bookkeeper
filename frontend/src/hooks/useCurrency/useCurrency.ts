import * as React from 'react';
import { SettingsContext } from '../../app/contexts/settings/SettingsContext';
import { Currency, CurrencyProperties, currencyPropertiesMap } from '../../types/settings/currency';

export function useCurrency(): { properties: CurrencyProperties, toDatabaseAmount: (value: number | null | undefined) => number, getActualAmount: (value: number | null | undefined) => number, format: (value: number | null | undefined) => string } {
  const { settings } = React.useContext(SettingsContext);
  const currency: Currency = settings?.general.currency ?? Currency.KRW;

  const properties = currencyPropertiesMap[currency];

  const getActualAmount = (value: number | null | undefined) => {
    return (value ?? 0) / Math.pow(10, properties.decimals);
  }

  const toDatabaseAmount = (value: number | null | undefined) => {
    return Math.round((value ?? 0) * Math.pow(10, properties.decimals));
  }

  const format = (value: number | null | undefined): string => {
    if (value == null) return '';
    const s = value.toLocaleString();
    if (properties.decimals === 0) return s;
    const first = s.substring(0, s.length - properties.decimals);
    const last = s.substring(s.length - properties.decimals);
    return first.concat('.').concat(last);
  }

  return { properties, getActualAmount, toDatabaseAmount, format }
}