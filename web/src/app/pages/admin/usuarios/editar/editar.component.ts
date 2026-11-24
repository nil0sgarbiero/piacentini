import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoModule, PoSelectOption } from '@po-ui/ng-components';
import { PERFIS_USUARIO, UsuarioView } from '../usuarios.model';

@Component({
  selector: 'app-usuario-editar',
  imports: [PoModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class UsuarioEditarComponent {
  @Output() readonly salvo = new EventEmitter<void>();

  readonly perfis: PoSelectOption[] = PERFIS_USUARIO;
  readonly visivel = signal(false);
  usuario: UsuarioView = { id: 0, nome: '', login: '', perfil: 'USER', ativo: true };

  open(usuario: UsuarioView): void {
    this.usuario = { ...usuario };
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
