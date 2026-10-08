import { Routes } from '@angular/router';
import { AddEntryComponent } from './features/investments/add-entry/add-entry.component';
import { AddInvestmentComponent } from './features/investments/add-investment/add-investment.component';
import { InvestmentDetailComponent } from './features/investments/detail/investment-detail.component';
import { EditInvestmentComponent } from './features/investments/edit-investment/edit-investment.component';
import { InvestmentsListComponent } from './features/investments/list/investments-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'investments' },
  { path: 'investments', component: InvestmentsListComponent },
  { path: 'investments/new', component: AddInvestmentComponent },
  { path: 'investments/:id/add-entry', component: AddEntryComponent },
  { path: 'investments/:id/edit', component: EditInvestmentComponent },
  { path: 'investments/:id', component: InvestmentDetailComponent },
  { path: '**', redirectTo: 'investments' },
];
