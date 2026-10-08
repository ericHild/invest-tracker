import { computed, signal } from '@angular/core';
import { db } from '../db/investments.db';
import { InvestmentEntry } from '../models/entry.model';
import { Investment } from '../models/investment.model';

export const investments = signal<Investment[]>([]);
export interface InvestmentSummary extends Investment {
  currentBalance: number;
  totalDeposited: number;
  gain: number;
}

export const investmentSummaries = signal<InvestmentSummary[]>([]);
export const investment = signal<Investment | undefined>(undefined);
export const entries = signal<InvestmentEntry[]>([]);

export async function loadInvestments(): Promise<void> {
  const [list, allEntries] = await Promise.all([db.investments.toArray(), db.entries.toArray()]);
  investments.set(list);

  const entriesByInvestment = new Map<number, InvestmentEntry[]>();
  for (const entry of allEntries) {
    const group = entriesByInvestment.get(entry.investmentId) ?? [];
    group.push(entry);
    entriesByInvestment.set(entry.investmentId, group);
  }

  investmentSummaries.set(
    list.map((item) => {
      const history = (entriesByInvestment.get(item.id!) ?? []).sort((left, right) => {
        const dateOrder = left.date.localeCompare(right.date);
        return dateOrder || (left.id ?? 0) - (right.id ?? 0);
      });
      const totalDeposited =
        item.initialAmount + history.reduce((total, entry) => total + entry.deposit, 0);

      return {
        ...item,
        totalDeposited,
        currentBalance: history.at(-1)?.balance ?? item.initialAmount,
        gain: (history.at(-1)?.balance ?? item.initialAmount) - totalDeposited,
      };
    }),
  );
}

export async function loadInvestmentData(investmentId: number): Promise<void> {
  investment.set(undefined);
  entries.set([]);

  const [selectedInvestment, investmentEntries] = await Promise.all([
    db.investments.get(investmentId),
    db.entries.where('investmentId').equals(investmentId).toArray(),
  ]);

  investment.set(selectedInvestment);
  entries.set(
    investmentEntries.sort((left, right) => {
      const dateOrder = left.date.localeCompare(right.date);
      return dateOrder || (left.id ?? 0) - (right.id ?? 0);
    }),
  );
}

export async function addInvestment(value: Investment): Promise<void> {
  await db.investments.add(value);
  await loadInvestments();
}

export async function updateInvestment(id: number, value: Investment): Promise<void> {
  await db.investments.update(id, value);
  await loadInvestments();
  if (investment()?.id === id) investment.set({ ...value, id });
}

export async function deleteInvestment(id: number): Promise<void> {
  await db.transaction('rw', db.investments, db.entries, async () => {
    await db.entries.where('investmentId').equals(id).delete();
    await db.investments.delete(id);
  });

  await loadInvestments();
  if (investment()?.id === id) {
    investment.set(undefined);
    entries.set([]);
  }
}

export async function addEntry(entry: InvestmentEntry): Promise<void> {
  await db.entries.add(entry);
  await Promise.all([
    loadInvestments(),
    ...(investment()?.id === entry.investmentId ? [loadInvestmentData(entry.investmentId)] : []),
  ]);
}

export const totalDeposited = computed(() =>
  (investment()?.initialAmount ?? 0) + entries().reduce((total, entry) => total + entry.deposit, 0),
);

export const currentBalance = computed(() => {
  const latestEntry = entries().at(-1);
  return latestEntry?.balance ?? investment()?.initialAmount ?? 0;
});

export const gain = computed(() => currentBalance() - totalDeposited());

export const realYield = computed(() => {
  const deposited = totalDeposited();
  return deposited > 0 ? (gain() / deposited) * 100 : 0;
});

export const lastVariation = computed(() => {
  const history = entries();
  return history.length < 2 ? 0 : history.at(-1)!.balance - history.at(-2)!.balance;
});

export const lastDeclaredYield = computed(() => entries().at(-1)?.declaredYield ?? 0);
