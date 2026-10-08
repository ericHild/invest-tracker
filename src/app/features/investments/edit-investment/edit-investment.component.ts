import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { db } from '../../../core/db/investments.db';
import { Investment } from '../../../core/models/investment.model';
import { deleteInvestment, updateInvestment } from '../../../core/store/investments.store';

@Component({
  selector: 'app-edit-investment',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page-container page-container--narrow">
      <button class="back-link" (click)="goBack()">← Retour au placement</button>
      <p class="eyebrow">Gérer votre suivi</p>
      <h1 class="page-title">Modifier l’investissement</h1>

      @if (loading) {
        <div class="empty-state form-panel">Chargement…</div>
      } @else if (!investment) {
        <div class="empty-state form-panel">Investissement introuvable.</div>
      } @else {
        <form class="surface-card form-stack form-panel" (ngSubmit)="save()">
          <label class="field">
            <span class="field-label">Nom de l’investissement</span>
            <input class="field-control" [(ngModel)]="investment.name" name="name" required />
          </label>
          <label class="field">
            <span class="field-label">Montant initial</span>
            <input class="field-control" [(ngModel)]="investment.initialAmount" name="initialAmount" type="number" min="0" step="0.01" required />
          </label>
          <label class="field">
            <span class="field-label">Versement mensuel prévu <span class="muted">(facultatif)</span></span>
            <input class="field-control" [(ngModel)]="investment.monthlyDeposit" name="monthlyDeposit" type="number" min="0" step="0.01" />
          </label>

          <div class="form-actions">
            <button class="button-primary button-full" type="submit">Enregistrer les changements</button>
            <button class="button-danger button-full" type="button" (click)="delete()">Supprimer cet investissement</button>
          </div>
        </form>
      }
    </section>
  `,
})
export class EditInvestmentComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  investmentId = 0;
  investment: Investment | undefined;
  loading = true;

  async ngOnInit(): Promise<void> {
    this.investmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.investmentId) || this.investmentId <= 0) {
      this.loading = false;
      return;
    }

    this.investment = await db.investments.get(this.investmentId);
    this.loading = false;
  }

  async save(): Promise<void> {
    if (!this.investment) return;
    this.investment.name = this.investment.name.trim();
    await updateInvestment(this.investmentId, this.investment);
    this.goBack();
  }

  async delete(): Promise<void> {
    await deleteInvestment(this.investmentId);
    await this.router.navigate(['/investments']);
  }

  goBack(): void {
    void this.router.navigate(['/investments', this.investmentId]);
  }
}
