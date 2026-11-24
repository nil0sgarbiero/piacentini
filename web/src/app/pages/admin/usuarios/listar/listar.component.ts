import { Component, ViewChild, computed, input, signal } from '@angular/core';
import { PoTableAction, PoTableColumn, PoTableModule } from '@po-ui/ng-components';
import { UsuarioEditarComponent } from '../editar/editar.component';
import { UsuarioView } from '../usuarios.model';

@Component({
  selector: 'app-usuario-listar',
  imports: [PoTableModule, UsuarioEditarComponent],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent {
  @ViewChild(UsuarioEditarComponent) private modalEditar!: UsuarioEditarComponent;

  readonly filtroNome = input('');
  readonly filtroPerfil = input('');
  readonly filtroSituacao = input('');

  readonly carregando = signal(false);
  readonly usuarios = signal<UsuarioView[]>([]);

  readonly colunas: PoTableColumn[] = [
    { property: 'nome', label: 'Nome', width: '300px' },
    { property: 'login', label: 'Login', width: '200px' },
    { property: 'perfil', label: 'Perfil' },
    { property: 'ativo', label: 'Status', type: 'boolean' },
  ];

  readonly acoesTabela: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'an an-pencil-simple',
      action: (usuario: UsuarioView) => this.editar(usuario),
    },
  ];

  readonly usuariosFiltrados = computed(() => {
    const nome = this.filtroNome().toLowerCase().trim();
    const perfil = this.filtroPerfil();
    const situacao = this.filtroSituacao();

    return this.usuarios().filter((item) => {
      if (nome && !item.nome.toLowerCase().includes(nome)) return false;
      if (perfil && item.perfil !== perfil) return false;
      if (situacao && item.ativo !== (situacao === 'ativo')) return false;
      return true;
    });
  });

  constructor() {
    void this.carregar();
  }

  editar(usuario: UsuarioView): void {
    this.modalEditar.open(usuario);
  }

  async carregar(): Promise<void> {
    this.carregando.set(true);

    try {
      // TODO: substituir pelo GET real da API
      this.usuarios.set([
        { id: 1, nome: 'Administrador', login: 'admin', perfil: 'ADMIN', ativo: true },
        { id: 2, nome: 'João Silva', login: 'joao.silva', perfil: 'USER', ativo: true },
        { id: 3, nome: 'Maria Souza', login: 'maria.souza', perfil: 'USER', ativo: true },
        { id: 4, nome: 'Carlos Lima', login: 'carlos.lima', perfil: 'USER', ativo: false },
      ]);
    } finally {
      this.carregando.set(false);
    }
  }
}
