import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { PermissaoPayload } from '../permissoes.model';

@Component({
  selector: 'app-permissao-incluir',
  imports: [PoModule, FormsModule],
  templateUrl: './incluir.component.html',
  styleUrls: ['./incluir.component.css'],
})
export class PermissaoIncluirComponent {
  @Output() readonly salvo = new EventEmitter<void>();

  readonly visivel = signal(false);
  permissao: PermissaoPayload = { nome: '', modulo: '', ativo: true, descricao: '' };

  open(): void {
    this.permissao = { nome: '', modulo: '', ativo: true, descricao: '' };
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
