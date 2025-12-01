import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError, delay } from 'rxjs';

import { RegisterModalComponent } from './register-modal.component';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest, RegisterResponse } from '../../../types/auth.types';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;
  let modalService: ModalService;
  let authService: jasmine.SpyObj<AuthService>;

  // Constants for test timeouts
  const OBSERVABLE_DELAY_MS = 100;
  const MODAL_SWITCH_DELAY_MS = 2000;

  // Test data constants (clearly marked as test-only, not real credentials)
  const TEST_INVALID_PASSWORD_SHORT = 'short'; // Intentionally short for validation testing // NOSONAR
  const TEST_VALID_PASSWORD = 'TestPassword123'; // Test-only password for validation testing // NOSONAR
  const TEST_INVALID_USERNAME_SHORT = 'ab'; // Intentionally short for validation testing
  const TEST_INVALID_EMAIL = 'invalid-email'; // Invalid format for validation testing
  const TEST_VALID_USERNAME = 'testuser123';
  const TEST_VALID_EMAIL = 'test@example.com';

  const mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockModalService = {
    isOpen: jasmine.createSpy('isOpen').and.returnValue(true),
    openModal: jasmine.createSpy('openModal'),
    closeModal: jasmine.createSpy('closeModal'),
    switchModal: jasmine.createSpy('switchModal'),
    currentModalSignal: {
      subscribe: jasmine.createSpy('subscribe')
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterModalComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ModalService, useValue: mockModalService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.registerForm).toBeDefined();
      expect(component.registerForm.get('username')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
    });

    it('should have initial state', () => {
      expect(component.errorMessage).toBeNull();
      expect(component.successMessage).toBeNull();
      expect(component.loading).toBeFalse();
    });
  });

  describe('Form Validation', () => {
    it('should require username', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.hasError('required')).toBeTrue();
    });

    it('should validate username min length (3 characters)', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('ab');
      expect(usernameControl?.hasError('minlength')).toBeTrue();

      usernameControl?.setValue('abc');
      expect(usernameControl?.hasError('minlength')).toBeFalse();
    });

    it('should validate username max length (20 characters)', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('a'.repeat(21));
      expect(usernameControl?.hasError('maxlength')).toBeTrue();

      usernameControl?.setValue('a'.repeat(20));
      expect(usernameControl?.hasError('maxlength')).toBeFalse();
    });

    it('should validate username alphanumeric pattern', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('user@name');
      expect(usernameControl?.hasError('pattern')).toBeTrue();

      usernameControl?.setValue('username123');
      expect(usernameControl?.hasError('pattern')).toBeFalse();
    });

    it('should require email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBeTrue();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTrue();

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.hasError('email')).toBeFalse();
    });

    it('should require password', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBeTrue();
    });

    it('should validate password min length (8 characters)', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue(TEST_INVALID_PASSWORD_SHORT);
      expect(passwordControl?.hasError('minlength')).toBeTrue();

      passwordControl?.setValue(TEST_VALID_PASSWORD);
      expect(passwordControl?.hasError('minlength')).toBeFalse();
    });

    it('should mark form as invalid with invalid inputs', () => {
      component.registerForm.setValue({
        username: TEST_INVALID_USERNAME_SHORT,
        email: TEST_INVALID_EMAIL,
        password: TEST_INVALID_PASSWORD_SHORT
      });
      expect(component.registerForm.valid).toBeFalse();
    });

    it('should mark form as valid with valid inputs', () => {
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      expect(component.registerForm.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      component.registerForm.setValue({
        username: TEST_INVALID_USERNAME_SHORT,
        email: TEST_INVALID_EMAIL,
        password: TEST_INVALID_PASSWORD_SHORT
      });

      component.onSubmit();

      expect(authService.register).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should call AuthService.register() with form data when form is valid', fakeAsync(() => {
      const registerData: RegisterRequest = {
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      };
      component.registerForm.setValue(registerData);
      authService.register.and.returnValue(
        of({} as RegisterResponse).pipe(delay(OBSERVABLE_DELAY_MS))
      );

      component.onSubmit();

      expect(authService.register).toHaveBeenCalledWith(registerData);
      expect(component.loading).toBeTrue(); // Loading should be true before observable resolves

      tick(OBSERVABLE_DELAY_MS); // Let observable resolve
      expect(component.loading).toBeFalse(); // Loading should be false after success
    }));

    it('should set loading to true when submitting', fakeAsync(() => {
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      authService.register.and.returnValue(
        of({} as RegisterResponse).pipe(delay(OBSERVABLE_DELAY_MS))
      );

      component.onSubmit();

      // Loading should be true immediately after submission
      expect(component.loading).toBeTrue();

      // After observable resolves, loading should be false
      tick(OBSERVABLE_DELAY_MS);
      expect(component.loading).toBeFalse();
    }));

    it('should clear error message when submitting', () => {
      component.errorMessage = 'Previous error';
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      authService.register.and.returnValue(of({} as RegisterResponse));

      component.onSubmit();

      expect(component.errorMessage).toBeNull();
    });

    it('should clear success message initially when submitting', fakeAsync(() => {
      component.successMessage = 'Previous success';
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      authService.register.and.returnValue(
        of({} as RegisterResponse).pipe(delay(OBSERVABLE_DELAY_MS))
      );

      component.onSubmit();

      // Initially cleared before observable resolves
      expect(component.successMessage).toBeNull();

      // Wait for observable to resolve
      tick(OBSERVABLE_DELAY_MS);

      // After success, message should be set
      expect(component.successMessage).toBe('Registration successful! Redirecting to login...');
    }));
  });

  describe('Successful Registration', () => {
    it('should set success message on successful registration', fakeAsync(() => {
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      authService.register.and.returnValue(
        of({
          id: '123',
          username: TEST_VALID_USERNAME,
          email: TEST_VALID_EMAIL,
          message: 'Registration successful'
        } as RegisterResponse)
      );

      component.onSubmit();

      // Wait for observable to resolve
      tick();

      expect(component.loading).toBeFalse();
      expect(component.successMessage).toBe('Registration successful! Redirecting to login...');
      expect(component.errorMessage).toBeNull();
    }));

    it('should switch to login modal after successful registration', fakeAsync(() => {
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      authService.register.and.returnValue(of({} as RegisterResponse));

      component.onSubmit();

      // Wait for observable to resolve
      tick();

      // Wait for modal switch delay before switching modal
      tick(MODAL_SWITCH_DELAY_MS);

      expect(modalService.switchModal).toHaveBeenCalledWith('register', 'login');
    }));
  });

  describe('Registration Errors', () => {
    it('should set error message on registration failure', () => {
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      const errorResponse = {
        error: { message: 'Username already exists: testuser' }
      };
      authService.register.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.loading).toBeFalse();
      // Error message comes directly from API response
      expect(component.errorMessage).toBe('Username already exists: testuser');
      expect(component.successMessage).toBeNull();
    });

    it('should use default error message when error response has no message', () => {
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      authService.register.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(component.errorMessage).toBe('Registration failed. Please try again.');
    });

    it('should set loading to false on error', () => {
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      authService.register.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(component.loading).toBeFalse();
    });
  });

  describe('Modal Management', () => {
    it('should switch to login modal when switchToLogin() is called', () => {
      component.switchToLogin();
      expect(modalService.switchModal).toHaveBeenCalledWith('register', 'login');
    });

    it('should close modal when close() is called', () => {
      component.close();
      expect(modalService.closeModal).toHaveBeenCalled();
    });

    it('should reset form when modal is closed', () => {
      component.registerForm.setValue({
        username: TEST_VALID_USERNAME,
        email: TEST_VALID_EMAIL,
        password: TEST_VALID_PASSWORD
      });
      component.errorMessage = 'Some error';
      component.successMessage = 'Some success';
      component.loading = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (modalService as any).isOpen.and.returnValue(false);
      // Simulate modal closing by triggering effect
      component.isOpen = false;
      component['resetForm']();

      expect(component.registerForm.get('username')?.value).toBeNull();
      expect(component.errorMessage).toBeNull();
      expect(component.successMessage).toBeNull();
      expect(component.loading).toBeFalse();
    });
  });

  describe('Form Getters', () => {
    it('should return username form control', () => {
      expect(component.username).toBe(component.registerForm.get('username'));
    });

    it('should return email form control', () => {
      expect(component.email).toBe(component.registerForm.get('email'));
    });

    it('should return password form control', () => {
      expect(component.password).toBe(component.registerForm.get('password'));
    });
  });
});
