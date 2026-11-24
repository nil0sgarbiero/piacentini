import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { SubmoduloConfig,getDataHoje } from '../../core/models/submodulo.model';

@Component({
  selector: 'app-pcp',
  imports: [PoModule],
  templateUrl: './pcp.component.html',
  styleUrls: ['./pcp.component.css'],
})
export class PcpComponent {
  readonly breadcrumb = {
  items: [
    { label: 'Painel', link: '/' },
    { label: 'PCP' },
  ],
};

  private router = inject(Router);

  readonly dataHoje = getDataHoje();

  readonly submodulos: SubmoduloConfig[] = [
    { key: 'ordens', label: 'Ordens de Produção', icon: 'an an-list-checks', route: '/pcp/ordens' },
    { key: 'programacao', label: 'Programação', icon: 'an an-calendar-check', route: '/pcp/programacao' },
    { key: 'apontamento', label: 'Apontamento', icon: 'an an-clock', route: '/pcp/apontamento' },
    { key: 'capacidade', label: 'Capacidade', icon: 'an an-chart-bar', route: '/pcp/capacidade' },
    { key: 'roteiros', label: 'Roteiros', icon: 'an an-path', route: '/pcp/roteiros' },
    { key: 'indicadores', label: 'Indicadores', icon: 'an an-chart-line', route: '/pcp/indicadores' },
  ];

  abrir(sub: SubmoduloConfig): void {
    this.router.navigate([sub.route]);
  }
}
