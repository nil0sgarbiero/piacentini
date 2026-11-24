import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { ListarComponent } from './listar/listar.component';
import { ModuloIncluirComponent } from './incluir/incluir.component';
import { SITUACOES_MODULO } from './modulos.model';

@Component({
  selector: 'app-modulos',
  imports: [FormsModule, PoFieldModule, PoButtonModule, ListarComponent, ModuloIncluirComponent],
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css'],
})
export class ModulosComponent {
  @ViewChild(ListarComponent) private listar!: ListarComponent;
  @ViewChild(ModuloIncluirComponent) private modalIncluir!: ModuloIncluirComponent;

  readonly situacoes: PoSelectOption[] = SITUACOES_MODULO;

  filtroNome = '';
  filtroSituacao = '';

  incluir(): void {
    this.modalIncluir.open();
  }

  recarregar(): void {
    this.listar.carregar();
  }
}
