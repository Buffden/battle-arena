import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  isOpen = false;

  constructor(
    private fb: FormBuilder,
    public modalService: ModalService,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9]+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    // React to modal state changes
    effect(() => {
      this.isOpen = this.modalService.isOpen('register');
      if (!this.isOpen) {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Registration successful! Redirecting to login...';
          // Switch to login modal after 2 seconds
          setTimeout(() => {
            this.modalService.switchModal('register', 'login');
          }, 2000);
        },
        error: error => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  switchToLogin(): void {
    this.modalService.switchModal('register', 'login');
  }

  close(): void {
    this.modalService.closeModal();
  }

  private resetForm(): void {
    this.registerForm.reset();
    this.errorMessage = null;
    this.successMessage = null;
    this.loading = false;
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }
}
