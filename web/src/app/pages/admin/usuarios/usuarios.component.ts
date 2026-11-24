import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { ListarComponent } from './listar/listar.component';
import { UsuarioIncluirComponent } from './incluir/incluir.component';
import { PERFIS_USUARIO, SITUACOES_USUARIO } from './usuarios.model';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, PoFieldModule, PoButtonModule, ListarComponent, UsuarioIncluirComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent {
  @ViewChild(ListarComponent) private listar!: ListarComponent;
  @ViewChild(UsuarioIncluirComponent) private modalIncluir!: UsuarioIncluirComponent;

  readonly situacoes: PoSelectOption[] = SITUACOES_USUARIO;
  readonly perfis: PoSelectOption[] = PERFIS_USUARIO;

  filtroNome = '';
  filtroPerfil = '';
  filtroSituacao = '';

  incluir(): void {
    this.modalIncluir.open();
  }

  recarregar(): void {
    this.listar.carregar();
  }
}
