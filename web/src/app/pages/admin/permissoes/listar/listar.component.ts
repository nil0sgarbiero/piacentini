import { Component, ViewChild, computed, input, signal } from '@angular/core';
import { PoTableAction, PoTableColumn, PoTableModule } from '@po-ui/ng-components';
import { PermissaoEditarComponent } from '../editar/editar.component';
import { PermissaoView } from '../permissoes.model';

@Component({
  selector: 'app-permissao-listar',
  imports: [PoTableModule, PermissaoEditarComponent],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent {
  @ViewChild(PermissaoEditarComponent) private modalEditar!: PermissaoEditarComponent;

  readonly filtroNome = input('');
  readonly filtroModulo = input('');
  readonly filtroSituacao = input('');

  readonly carregando = signal(false);
  readonly permissoes = signal<PermissaoView[]>([]);

  readonly colunas: PoTableColumn[] = [
    { property: 'nome', label: 'Permissão', width: '300px' },
    { property: 'modulo', label: 'Módulo' },
    { property: 'ativo', label: 'Status', type: 'boolean' },
    { property: 'descricao', label: 'Descrição', width: '400px' },
  ];

  readonly acoesTabela: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'an an-pencil-simple',
      action: (permissao: PermissaoView) => this.editar(permissao),
    },
  ];

  readonly permissoesFiltradas = computed(() => {
    const nome = this.filtroNome().toLowerCase().trim();
    const modulo = this.filtroModulo().toLowerCase().trim();
    const situacao = this.filtroSituacao();

    return this.permissoes().filter((item) => {
      if (nome && !item.nome.toLowerCase().includes(nome)) return false;
      if (modulo && !item.modulo.toLowerCase().includes(modulo)) return false;
      if (situacao && item.ativo !== (situacao === 'ativo')) return false;
      return true;
    });
  });

  constructor() {
    void this.carregar();
  }

  editar(permissao: PermissaoView): void {
    this.modalEditar.open(permissao);
  }

  async carregar(): Promise<void> {
    this.carregando.set(true);

    try {
      // TODO: substituir pelo GET real da API
      this.permissoes.set([
        { id: 1, nome: 'Visualizar painel', modulo: 'Sistema', ativo: true, descricao: 'Acesso ao painel principal' },
        { id: 2, nome: 'Gerenciar usuários', modulo: 'Segurança', ativo: true, descricao: 'Cadastro e gerenciamento de usuários' },
        { id: 3, nome: 'Exportar relatórios', modulo: 'Financeiro', ativo: true, descricao: 'Gerar e exportar relatórios' },
        { id: 4, nome: 'Configurar módulos', modulo: 'Sistema', ativo: true, descricao: 'Configuração de módulos da aplicação' },
        { id: 5, nome: 'Permitir login', modulo: 'Segurança', ativo: false, descricao: 'Permitir ou bloquear login de usuários' },
      ]);
    } finally {
      this.carregando.set(false);
    }
  }
}
