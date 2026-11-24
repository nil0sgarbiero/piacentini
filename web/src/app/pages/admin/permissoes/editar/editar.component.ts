import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { PermissaoView } from '../permissoes.model';

@Component({
  selector: 'app-permissao-editar',
  imports: [PoModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class PermissaoEditarComponent {
  @Output() readonly salvo = new EventEmitter<void>();

  readonly visivel = signal(false);
  permissao: PermissaoView = { id: 0, nome: '', modulo: '', ativo: true, descricao: '' };

  open(permissao: PermissaoView): void {
    this.permissao = { ...permissao };
    this.visivel.set(true);
  }

  fechar(): void {
    this.visivel.set(false);
  }

  onCancelar(): void {
    this.fechar();
  }

  salvar(): void {
    this.salvo.emit();
    this.fechar();
  }
}
