import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { LoginModalComponent } from '../modals/login-modal/login-modal.component';
import { RegisterModalComponent } from '../modals/register-modal/register-modal.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, LoginModalComponent, RegisterModalComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  title = 'BATTLE ARENA';
  subtitle = 'Enter the Arena. Prove Your Skills.';

  constructor(public modalService: ModalService) {}

  openLogin(): void {
    this.modalService.openModal('login');
  }

  openRegister(): void {
    this.modalService.openModal('register');
  }
}
