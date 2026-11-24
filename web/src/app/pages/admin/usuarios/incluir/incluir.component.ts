import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoModule, PoSelectOption } from '@po-ui/ng-components';
import { PERFIS_USUARIO, UsuarioPayload } from '../usuarios.model';

@Component({
  selector: 'app-usuario-incluir',
  imports: [PoModule, FormsModule],
  templateUrl: './incluir.component.html',
  styleUrls: ['./incluir.component.css'],
})
export class UsuarioIncluirComponent {
  @Output() readonly salvo = new EventEmitter<void>();

  readonly perfis: PoSelectOption[] = PERFIS_USUARIO;
  readonly visivel = signal(false);
  usuario: UsuarioPayload = { nome: '', login: '', perfil: 'USER', ativo: true };

  open(): void {
    this.usuario = { nome: '', login: '', perfil: 'USER', ativo: true };
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
