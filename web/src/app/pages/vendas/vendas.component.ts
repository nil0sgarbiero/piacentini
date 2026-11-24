import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { SubmoduloConfig,getDataHoje } from '../../core/models/submodulo.model';


@Component({
  selector: 'app-vendas',
  imports: [PoModule],
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css'],
})
export class VendasComponent {
        private router = inject(Router);

  readonly dataHoje = getDataHoje();
  readonly submodulos: SubmoduloConfig[] = [
  { key: 'clientes', label: 'Clientes', icon: 'an an-users', route: '/vendas/clientes' },
  { key: 'orcamentos', label: 'Orçamentos', icon: 'an an-file-text', route: '/vendas/orcamentos' },
  { key: 'pedidos', label: 'Pedidos de Venda', icon: 'an an-shopping-cart', route: '/vendas/pedidos' },
  { key: 'faturamento', label: 'Faturamento', icon: 'an an-receipt', route: '/vendas/faturamento' },
  { key: 'comissoes', label: 'Comissões', icon: 'an an-currency-dollar', route: '/vendas/comissoes' },
  { key: 'metas', label: 'Metas', icon: 'an an-target', route: '/vendas/metas' },
];
  abrir(sub: SubmoduloConfig): void {
    this.router.navigate([sub.route]);
  }
}
