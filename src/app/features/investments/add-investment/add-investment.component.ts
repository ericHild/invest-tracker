import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addInvestment } from '../../../core/store/investments.store';
import { Investment } from '../../../core/models/investment.model';

@Component({
  selector: 'app-add-investment',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page-container page-container--narrow">
      <button class="back-link" (click)="goBack()">← Mes investissements</button>
      <p class="eyebrow">Un nouveau suivi</p>
      <h1 class="page-title">Ajouter un investissement</h1>
      <p class="page-description">Renseignez les premières informations. Vous pourrez ajouter vos relevés à votre rythme.</p>

      <form class="surface-card form-stack form-panel" (ngSubmit)="save()">
        <label class="field">
          <span class="field-label">Nom de l’investissement</span>
          <input class="field-control" type="text" [(ngModel)]="name" name="name" placeholder="Ex. Assurance-vie" autocomplete="off" required />
        </label>

        <label class="field">
          <span class="field-label">Montant initial</span>
          <input class="field-control" type="number" [(ngModel)]="initialAmount" name="initialAmount" min="0" step="0.01" placeholder="0,00 €" required />
          <span class="field-hint">Le montant investi au démarrage du placement.</span>
        </label>

        <label class="field">
          <span class="field-label">Versement mensuel prévu <span class="muted">(facultatif)</span></span>
          <input class="field-control" type="number" [(ngModel)]="monthlyDeposit" name="monthlyDeposit" min="0" step="0.01" placeholder="0,00 €" />
          <span class="field-hint">À titre indicatif : vous pourrez saisir vos versements réels dans chaque relevé.</span>
        </label>

        <div class="form-actions">
          <button class="button-primary button-full" type="submit">Créer l’investissement</button>
          <button class="button-quiet button-full" type="button" (click)="goBack()">Annuler</button>
        </div>
      </form>
    </section>
  `,
})
export class AddInvestmentComponent {
  private readonly router = inject(Router);

  name = '';
  initialAmount: number | null = null;
  monthlyDeposit?: number;

  async save(): Promise<void> {
    if (this.initialAmount == null) return;

    const value: Investment = {
      name: this.name.trim(),
      initialAmount: this.initialAmount,
      monthlyDeposit: this.monthlyDeposit,
    };

    await addInvestment(value);
    await this.router.navigate(['/investments']);
  }

  goBack(): void {
    void this.router.navigate(['/investments']);
  }
}
