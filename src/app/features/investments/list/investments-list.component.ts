import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatCurrency } from '../../../core/formatters';
import {
  investmentSummaries,
  loadInvestments,
} from '../../../core/store/investments.store';

@Component({
  selector: 'app-investments-list',
  standalone: true,
  template: `
    <section class="page-container">
      <div class="portfolio-hero">
        <p class="portfolio-label">Votre patrimoine suivi</p>
        <h1 class="portfolio-value">{{ currency(totalBalance()) }}</h1>
        <div class="portfolio-meta">
          <span>Capital investi <strong>{{ currency(totalDeposited()) }}</strong></span>
          <span>Évolution <strong>{{ currency(totalGain()) }}</strong></span>
        </div>
        <div class="hero-actions">
          <button class="button-primary" (click)="addInvestment()">＋ Ajouter un investissement</button>
        </div>
      </div>

      <div class="section-heading">
        <div>
          <p class="eyebrow">Votre épargne, à votre rythme</p>
          <h2 class="section-title">Mes investissements</h2>
        </div>
        <span class="muted">{{ summaries().length }} placement{{ summaries().length > 1 ? 's' : '' }}</span>
      </div>

      @if (summaries().length === 0) {
        <div class="empty-state">
          <p>Votre espace est prêt. Ajoutez un investissement pour commencer à suivre son évolution.</p>
          <button class="button-primary" (click)="addInvestment()">Créer mon premier investissement</button>
        </div>
      } @else {
        <div class="investment-grid">
          @for (item of summaries(); track item.id) {
            <button class="investment-card" type="button" (click)="openDetail(item.id!)">
              <div class="investment-card-top">
                <span class="investment-icon">{{ item.name.charAt(0).toUpperCase() }}</span>
                <span class="investment-name">{{ item.name }}</span>
              </div>
              <p class="investment-amount">{{ currency(item.currentBalance) }}</p>
              <span class="investment-gain">
                {{ item.gain >= 0 ? '+' : '' }}{{ currency(item.gain) }} · {{ percent(item.gain, item.totalDeposited) }}
              </span>
              <div class="investment-footer">
                <span>Capital {{ currency(item.totalDeposited) }}</span>
                <span>{{ item.monthlyDeposit ? currency(item.monthlyDeposit) + ' / mois' : 'Voir le détail' }}</span>
              </div>
            </button>
          }

          <button class="add-card" type="button" (click)="addInvestment()">
            <span class="add-card-icon">＋</span>
            <span class="add-card-label">Ajouter un investissement</span>
          </button>
        </div>
      }
    </section>
  `,
})
export class InvestmentsListComponent implements OnInit {
  private readonly router = inject(Router);

  readonly summaries = investmentSummaries;
  readonly totalBalance = computed(() =>
    this.summaries().reduce((total, item) => total + item.currentBalance, 0),
  );
  readonly totalDeposited = computed(() =>
    this.summaries().reduce((total, item) => total + item.totalDeposited, 0),
  );
  readonly totalGain = computed(() => this.totalBalance() - this.totalDeposited());

  ngOnInit(): void {
    void loadInvestments();
  }

  currency(value: number): string {
    return formatCurrency(value);
  }

  percent(gain: number, deposited: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(
      deposited > 0 ? (gain / deposited) * 100 : 0,
    ) + ' %';
  }

  openDetail(id: number): void {
    void this.router.navigate(['/investments', id]);
  }

  addInvestment(): void {
    void this.router.navigate(['/investments/new']);
  }
}
