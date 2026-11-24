import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { SubmoduloConfig,getDataHoje } from '../../core/models/submodulo.model';
@Component({
  selector: 'app-engenharia',
  imports: [PoModule],
  templateUrl: './engenharia.component.html',
  styleUrls: ['./engenharia.component.css'],
})
export class EngenhariaComponent {
      private router = inject(Router);

  readonly dataHoje = getDataHoje();
  readonly submodulos: SubmoduloConfig[] = [
  { key: 'produtos', label: 'Produtos', icon: 'an an-package', route: '/engenharia/produtos' },
  { key: 'estruturas', label: 'Estruturas', icon: 'an an-tree-structure', route: '/engenharia/estruturas' },
  { key: 'roteiros', label: 'Roteiros de Produção', icon: 'an an-path', route: '/engenharia/roteiros' },
  { key: 'desenhos', label: 'Desenhos Técnicos', icon: 'an an-file-text', route: '/engenharia/desenhos' },
  { key: 'revisoes', label: 'Revisões', icon: 'an an-arrows-clockwise', route: '/engenharia/revisoes' },
  { key: 'materiais', label: 'Materiais', icon: 'an an-cube', route: '/engenharia/materiais' },
];
    abrir(sub: SubmoduloConfig): void {
    this.router.navigate([sub.route]);
  }
}
