import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { ModuloView } from '../modulos.model';

@Component({
  selector: 'app-modulo-editar',
  imports: [PoModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class ModuloEditarComponent {
  @Output() readonly salvo = new EventEmitter<void>();

  readonly visivel = signal(false);
  modulo: ModuloView = { id: 0, nome: '', descricao: '', ativo: true };

  open(modulo: ModuloView): void {
    this.modulo = { ...modulo };
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
