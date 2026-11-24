import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { SubmoduloConfig,getDataHoje } from '../../core/models/submodulo.model';

@Component({
  selector: 'app-suprimentos',
  imports: [PoModule],
  templateUrl: './suprimentos.component.html',
  styleUrls: ['./suprimentos.component.css'],
})
export class SuprimentosComponent {
      private router = inject(Router);

  readonly dataHoje = getDataHoje();
  readonly submodulos: SubmoduloConfig[] = [
  { key: 'requisicoes', label: 'Requisições', icon: 'an an-file-text', route: '/suprimentos/requisicoes' },
  { key: 'cotacoes', label: 'Cotações', icon: 'an an-scales', route: '/suprimentos/cotacoes' },
  { key: 'pedidos', label: 'Pedidos de Compra', icon: 'an an-shopping-cart', route: '/suprimentos/pedidos' },
  { key: 'fornecedores', label: 'Fornecedores', icon: 'an an-users', route: '/suprimentos/fornecedores' },
  { key: 'estoque', label: 'Estoque', icon: 'an an-warehouse', route: '/suprimentos/estoque' },
  { key: 'recebimentos', label: 'Recebimentos', icon: 'an an-truck', route: '/suprimentos/recebimentos' },
];
  abrir(sub: SubmoduloConfig): void {
    this.router.navigate([sub.route]);
  }
}
