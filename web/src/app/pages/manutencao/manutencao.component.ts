import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { SubmoduloConfig,getDataHoje } from '../../core/models/submodulo.model';

@Component({
  selector: 'app-manutencao',
  imports: [PoModule],
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.css'],
})
export class ManutencaoComponent {
  private router = inject(Router);

  readonly dataHoje = getDataHoje();
  readonly submodulos: SubmoduloConfig[] = [
    { key: 'ordens', label: 'Ordens de Serviço', icon: 'an an-clipboard-text', route: '/manutencao/ordens' },
    { key: 'preventiva', label: 'Manutenção Preventiva', icon: 'an an-calendar-check', route: '/manutencao/preventiva' },
    { key: 'corretiva', label: 'Manutenção Corretiva', icon: 'an an-wrench', route: '/manutencao/corretiva' },
    { key: 'equipamentos', label: 'Equipamentos', icon: 'an an-gear', route: '/manutencao/equipamentos' },
    { key: 'pecas', label: 'Peças e Insumos', icon: 'an an-package', route: '/manutencao/pecas' },
    { key: 'indicadores', label: 'Indicadores', icon: 'an an-chart-line', route: '/manutencao/indicadores' },
  ];
    abrir(sub: SubmoduloConfig): void {
    this.router.navigate([sub.route]);
  }
}
