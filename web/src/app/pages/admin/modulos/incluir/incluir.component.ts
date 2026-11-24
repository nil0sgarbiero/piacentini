import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { ModuloPayload } from '../modulos.model';

@Component({
  selector: 'app-modulo-incluir',
  imports: [PoModule, FormsModule],
  templateUrl: './incluir.component.html',
  styleUrls: ['./incluir.component.css'],
})
export class ModuloIncluirComponent {
  @Output() readonly salvo = new EventEmitter<void>();

  readonly visivel = signal(false);
  modulo: ModuloPayload = { nome: '', descricao: '', ativo: true };

  open(): void {
    this.modulo = { nome: '', descricao: '', ativo: true };
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
