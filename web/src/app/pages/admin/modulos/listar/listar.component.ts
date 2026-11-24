import { Component, ViewChild, computed, input, signal } from '@angular/core';
import { PoTableAction, PoTableColumn, PoTableModule } from '@po-ui/ng-components';
import { ModuloEditarComponent } from '../editar/editar.component';
import { ModuloView } from '../modulos.model';

@Component({
  selector: 'app-modulo-listar',
  imports: [PoTableModule, ModuloEditarComponent],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent {
  @ViewChild(ModuloEditarComponent) private modalEditar!: ModuloEditarComponent;

  readonly filtroNome = input('');
  readonly filtroSituacao = input('');

  readonly carregando = signal(false);
  readonly modulos = signal<ModuloView[]>([]);

  readonly colunas: PoTableColumn[] = [
    { property: 'nome', label: 'Módulo', width: '300px' },
    { property: 'descricao', label: 'Descrição', width: '400px' },
    { property: 'ativo', label: 'Status', type: 'boolean' },
  ];

  readonly acoesTabela: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'an an-pencil-simple',
      action: (modulo: ModuloView) => this.editar(modulo),
    },
  ];

  readonly modulosFiltrados = computed(() => {
    const nome = this.filtroNome().toLowerCase().trim();
    const situacao = this.filtroSituacao();

    return this.modulos().filter((item) => {
      if (nome && !item.nome.toLowerCase().includes(nome)) return false;
      if (situacao && item.ativo !== (situacao === 'ativo')) return false;
      return true;
    });
  });

  constructor() {
    void this.carregar();
  }

  editar(modulo: ModuloView): void {
    this.modalEditar.open(modulo);
  }

  async carregar(): Promise<void> {
    this.carregando.set(true);

    try {
      // TODO: substituir pelo GET real da API
      this.modulos.set([
        { id: 1, nome: 'PCP', descricao: 'Planejamento e controle da produção', ativo: true },
        { id: 2, nome: 'Engenharia', descricao: 'Engenharia de produtos e processos', ativo: true },
        { id: 3, nome: 'Financeiro', descricao: 'Contas, títulos e fluxo de caixa', ativo: true },
        { id: 4, nome: 'Suprimentos', descricao: 'Compras, estoque e fornecedores', ativo: true },
        { id: 5, nome: 'Vendas', descricao: 'Pedidos e faturamento', ativo: true },
        { id: 6, nome: 'Manutenção', descricao: 'Ordens e planos de manutenção', ativo: false },
      ]);
    } finally {
      this.carregando.set(false);
    }
  }
}
