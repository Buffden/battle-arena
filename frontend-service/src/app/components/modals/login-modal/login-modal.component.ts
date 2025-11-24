import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  isOpen = false;

  constructor(
    private readonly fb: FormBuilder,
    public modalService: ModalService,
    private readonly authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    effect(() => {
      this.isOpen = this.modalService.isOpen('login');
      if (!this.isOpen) {
        this.resetForm();
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.modalService.closeModal();
        },
        error: error => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }

  switchToRegister(): void {
    this.modalService.switchModal('login', 'register');
  }

  close(): void {
    this.modalService.closeModal();
  }

  private resetForm(): void {
    this.loginForm.reset();
    this.errorMessage = null;
    this.loading = false;
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
