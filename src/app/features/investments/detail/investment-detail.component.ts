import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatCurrency } from '../../../core/formatters';
import {
  currentBalance,
  entries,
  gain,
  investment,
  loadInvestmentData,
  totalDeposited,
} from '../../../core/store/investments.store';

@Component({
  selector: 'app-investment-detail',
  standalone: true,
  template: `
    <section class="page-container">
      <button class="back-link" (click)="goBack()">← Tous mes investissements</button>

      @if (investment(); as selectedInvestment) {
        <p class="eyebrow">Suivi de votre placement</p>
        <h1 class="page-title">{{ selectedInvestment.name }}</h1>
        <p class="page-description">Retrouvez ici vos relevés et l’évolution de votre investissement.</p>

        <div class="portfolio-hero detail-hero">
          <p class="portfolio-label">Valeur actuelle</p>
          <h2 class="portfolio-value">{{ currency(currentBalance()) }}</h2>
          <div class="portfolio-meta">
            <span>Évolution depuis les versements <strong>{{ currency(gain()) }}</strong></span>
          </div>
          <div class="hero-actions">
            <button class="button-primary" (click)="addEntry()">＋ Ajouter un relevé</button>
            <button class="button-secondary" (click)="editInvestment()">Modifier le placement</button>
          </div>
        </div>

        <div class="summary-grid">
          <article class="summary-card">
            <p class="summary-label">Capital investi</p>
            <p class="summary-value">{{ currency(totalDeposited()) }}</p>
          </article>
          <article class="summary-card">
            <p class="summary-label">Montant initial</p>
            <p class="summary-value">{{ currency(selectedInvestment.initialAmount) }}</p>
          </article>
          <article class="summary-card">
            <p class="summary-label">Versement prévu</p>
            <p class="summary-value">{{ selectedInvestment.monthlyDeposit ? currency(selectedInvestment.monthlyDeposit) + ' / mois' : 'Non défini' }}</p>
          </article>
        </div>

        <div class="section-heading">
          <div>
            <p class="eyebrow">Vos relevés saisis</p>
            <h2 class="section-title">Historique</h2>
          </div>
          <span class="muted">{{ entries().length }} relevé{{ entries().length > 1 ? 's' : '' }}</span>
        </div>

        @if (entries().length === 0) {
          <div class="empty-state">
            <p>Ajoutez votre premier relevé quand vous le souhaitez pour commencer l’historique.</p>
            <button class="button-primary" (click)="addEntry()">Ajouter un relevé</button>
          </div>
        } @else {
          <div class="history-list">
            @for (entry of entries(); track entry.id) {
              <article class="history-card">
                <span class="history-date">{{ entry.date }}</span>
                <span class="history-balance">{{ currency(entry.balance) }}</span>
                <div class="history-detail">
                  <span>Versement : {{ currency(entry.deposit) }}</span>
                  @if (entry.declaredYield != null) {
                    <span>Rendement déclaré : {{ entry.declaredYield }} %</span>
                  }
                </div>
                @if (entry.notes) {
                  <p class="history-note">{{ entry.notes }}</p>
                }
              </article>
            }
          </div>
        }
      } @else {
        <div class="empty-state">Chargement ou investissement introuvable.</div>
      }
    </section>
  `,
})
export class InvestmentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly investment = investment;
  readonly entries = entries;
  readonly totalDeposited = totalDeposited;
  readonly currentBalance = currentBalance;
  readonly gain = gain;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (Number.isInteger(id) && id > 0) void loadInvestmentData(id);
    });
  }

  currency(value: number): string {
    return formatCurrency(value);
  }

  goBack(): void {
    void this.router.navigate(['/investments']);
  }

  addEntry(): void {
    void this.router.navigate(['/investments', this.investment()?.id, 'add-entry']);
  }

  editInvestment(): void {
    void this.router.navigate(['/investments', this.investment()?.id, 'edit']);
  }
}
