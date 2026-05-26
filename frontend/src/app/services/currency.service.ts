import { Injectable, computed, signal } from '@angular/core';

export type AppCurrency = 'AOA' | 'USD' | 'EUR' | 'GBP' | 'BRL';

export interface CurrencyOption {
  code: AppCurrency;
  label: string;
  symbol: string;
  rateFromAoa: number;
}

const currencies: CurrencyOption[] = [
  { code: 'AOA', label: 'Kwanza', symbol: 'Kz', rateFromAoa: 1 },
  { code: 'USD', label: 'Dólar', symbol: '$', rateFromAoa: 0.0011 },
  { code: 'EUR', label: 'Euro', symbol: '€', rateFromAoa: 0.001 },
  { code: 'GBP', label: 'Libra', symbol: '£', rateFromAoa: 0.00086 },
  { code: 'BRL', label: 'Real', symbol: 'R$', rateFromAoa: 0.006 },
];

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly storageKey = 'travel_planner_currency';
  readonly options = currencies;
  readonly currency = signal<AppCurrency>((localStorage.getItem(this.storageKey) as AppCurrency) || 'AOA');
  readonly current = computed(() => currencies.find((item) => item.code === this.currency()) || currencies[0]);

  setCurrency(code: AppCurrency): void {
    this.currency.set(code);
    localStorage.setItem(this.storageKey, code);
  }

  convert(amountAoa: number | string | null | undefined): number {
    return Number(amountAoa || 0) * this.current().rateFromAoa;
  }

  format(amountAoa: number | string | null | undefined, maximumFractionDigits = 0): string {
    const option = this.current();
    const value = this.convert(amountAoa);

    return `${option.symbol} ${new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: option.code === 'AOA' ? 0 : 2,
      maximumFractionDigits: option.code === 'AOA' ? 0 : maximumFractionDigits || 2,
    }).format(value)}`;
  }
}
