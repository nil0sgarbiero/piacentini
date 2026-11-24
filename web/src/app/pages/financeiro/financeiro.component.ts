import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { SubmoduloConfig,getDataHoje } from '../../core/models/submodulo.model';

@Component({
  selector: 'app-financeiro',
  imports: [PoModule],
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css'],
})
export class FinanceiroComponent {
    private router = inject(Router);

  readonly dataHoje = getDataHoje();
  readonly submodulos: SubmoduloConfig[] = [
  { key: 'contas-pagar', label: 'Contas a Pagar', icon: 'an an-arrow-up-right', route: '/financeiro/contas-pagar' },
  { key: 'contas-receber', label: 'Contas a Receber', icon: 'an an-arrow-down-left', route: '/financeiro/contas-receber' },
  { key: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: 'an an-currency-dollar', route: '/financeiro/fluxo-caixa' },
  { key: 'tesouraria', label: 'Tesouraria', icon: 'an an-bank', route: '/financeiro/tesouraria' },
  { key: 'conciliacao', label: 'Conciliação Bancária', icon: 'an an-check-square', route: '/financeiro/conciliacao' },
  { key: 'relatorios', label: 'Relatórios', icon: 'an an-chart-bar', route: '/financeiro/relatorios' },
];
    abrir(sub: SubmoduloConfig): void {
    this.router.navigate([sub.route]);
  }
}
