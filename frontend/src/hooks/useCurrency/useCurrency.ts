import * as React from 'react';
import { SettingsContext } from '../../app/contexts/settings/SettingsContext';
import { Currency } from '../../types/settings/currency';

export function useCurrency(): { toString: (value: number, endsWithDecimal?: boolean) => string, toInt: (value: string) => number | undefined } {
  const { settings } = React.useContext(SettingsContext);
  const currency: Currency = settings?.general.currency ?? Currency.KRW;
  const decimals = DECIMALS[currency] ?? 0;

  const toString = (value: number, endsWithDecimal?: boolean): string => {
    const actualValue = value / (Math.pow(10, decimals));
    const r = actualValue.toLocaleString();
    console.log('toString:', value);
    console.log('ActualValue:', actualValue);
    console.log('Decimals', decimals);
    console.log('Return:', r)
    return r + ((decimals > 0 && endsWithDecimal) ? '.' : '');
  }

  const toInt = (value: string): number | undefined => {
    console.log('toInt:', value);
    value = value.replace(/\,/g, '');
    if (isNaN(Number(value))) {
      return undefined;
    }
    console.log('Value:', value);
    if (value.length < 1) return 0;
    if (decimals === 0 || !value.includes('.')) {
      const n = parseInt(value);
      const r = (isNaN(n) || n < 0) ? undefined : n;
      console.log('Return:', r);
      return r;
    }
    const parts = value.split('.');
    if (parts.length > 2) return undefined;
    const r = parts.length > 1 ? toInt(parts[0] + parts[1].substring(0, 2)) : toInt(parts[0]);
    console.log('Return:', r);
    return r;
  }

  return { toString, toInt }
}

const DECIMALS: {[key: string]: number} = {
  'USD': 2,
  'KRW': 0,
  'JPY': 0
}