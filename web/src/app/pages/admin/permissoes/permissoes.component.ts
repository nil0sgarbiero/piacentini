import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { ListarComponent } from './listar/listar.component';
import { PermissaoIncluirComponent } from './incluir/incluir.component';
import { SITUACOES_PERMISSAO } from './permissoes.model';

@Component({
  selector: 'app-permissoes',
  imports: [FormsModule, PoFieldModule, PoButtonModule, ListarComponent, PermissaoIncluirComponent],
  templateUrl: './permissoes.component.html',
  styleUrls: ['./permissoes.component.css'],
})
export class PermissoesComponent {
  @ViewChild(ListarComponent) private listar!: ListarComponent;
  @ViewChild(PermissaoIncluirComponent) private modalIncluir!: PermissaoIncluirComponent;

  readonly situacoes: PoSelectOption[] = SITUACOES_PERMISSAO;

  filtroNome = '';
  filtroModulo = '';
  filtroSituacao = '';

  incluir(): void {
    this.modalIncluir.open();
  }

  recarregar(): void {
    this.listar.carregar();
  }
}
