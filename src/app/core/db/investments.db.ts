import Dexie from 'dexie';
import { Investment } from '../models/investment.model';
import { InvestmentEntry } from '../models/entry.model';

export class InvestmentsDB extends Dexie {
  investments!: Dexie.Table<Investment, number>;
  entries!: Dexie.Table<InvestmentEntry, number>;

  constructor() {
    super('InvestmentsDB');

    this.version(1).stores({
      investments: '++id, name',
      entries: '++id, investmentId, date'
    });
  }
}

export const db = new InvestmentsDB();
