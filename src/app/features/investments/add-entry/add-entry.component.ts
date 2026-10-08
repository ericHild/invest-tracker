import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestmentEntry } from '../../../core/models/entry.model';
import { addEntry } from '../../../core/store/investments.store';

@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page-container page-container--narrow">
      <button class="back-link" (click)="goBack()">← Retour au placement</button>
      <p class="eyebrow">Faire le point</p>
      <h1 class="page-title">Ajouter un relevé</h1>
      <p class="page-description">Saisissez les informations figurant sur votre dernier relevé. Vous choisissez quand actualiser le suivi.</p>

      <form class="surface-card form-stack form-panel" (ngSubmit)="save()">
        <label class="field">
          <span class="field-label">Date du relevé</span>
          <input class="field-control" type="date" [(ngModel)]="date" name="date" required />
        </label>

        <label class="field">
          <span class="field-label">Valeur du placement</span>
          <input class="field-control" type="number" [(ngModel)]="balance" name="balance" min="0" step="0.01" placeholder="0,00 €" required />
          <span class="field-hint">Le solde total à la date de ce relevé.</span>
        </label>

        <label class="field">
          <span class="field-label">Versement effectué depuis le relevé précédent</span>
          <input class="field-control" type="number" [(ngModel)]="deposit" name="deposit" min="0" step="0.01" placeholder="0,00 €" />
          <span class="field-hint">Laissez 0 si vous n’avez pas effectué de versement.</span>
        </label>

        <label class="field">
          <span class="field-label">Rendement indiqué <span class="muted">(facultatif)</span></span>
          <input class="field-control" type="number" [(ngModel)]="declaredYield" name="declaredYield" step="0.01" placeholder="Ex. 3,5 %" />
        </label>

        <label class="field">
          <span class="field-label">Note <span class="muted">(facultatif)</span></span>
          <textarea class="field-control" [(ngModel)]="notes" name="notes" placeholder="Ajoutez un repère pour vous-même…"></textarea>
        </label>

        <div class="form-actions">
          <button class="button-primary button-full" type="submit">Enregistrer le relevé</button>
          <button class="button-quiet button-full" type="button" (click)="goBack()">Annuler</button>
        </div>
      </form>
    </section>
  `,
})
export class AddEntryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly investmentId = Number(this.route.snapshot.paramMap.get('id'));
  date = this.todayLocal();
  balance: number | null = null;
  deposit = 0;
  declaredYield?: number;
  notes = '';

  async save(): Promise<void> {
    if (this.balance == null || !Number.isInteger(this.investmentId) || this.investmentId <= 0) return;

    const entry: InvestmentEntry = {
      investmentId: this.investmentId,
      date: this.date,
      balance: this.balance,
      deposit: this.deposit,
      declaredYield: this.declaredYield,
      notes: this.notes.trim() || undefined,
    };

    await addEntry(entry);
    await this.router.navigate(['/investments', this.investmentId]);
  }

  goBack(): void {
    void this.router.navigate(['/investments', this.investmentId]);
  }

  private todayLocal(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }
}
