export interface InvestmentEntry {
  id?: number;
  investmentId: number;
  date: string;
  balance: number;
  deposit: number;
  declaredYield?: number;
  notes?: string;
}
