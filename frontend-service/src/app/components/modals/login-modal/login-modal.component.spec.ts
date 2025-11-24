import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError, delay } from 'rxjs';

import { LoginModalComponent } from './login-modal.component';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';
import { AuthResponse } from '../../../types/auth.types';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let modalService: jasmine.SpyObj<ModalService>;
  let authService: jasmine.SpyObj<AuthService>;

  const TEST_INVALID_USERNAME_SHORT = 'ab'; // Intentionally short for validation testing
  const TEST_VALID_USERNAME = 'testuser';
  const TEST_INVALID_PASSWORD_SHORT = 'short'; // Intentionally short for validation testing // NOSONAR
  const TEST_VALID_PASSWORD = 'TestPassword123'; // Test-only password for validation testing // NOSONAR
  const TEST_MOCK_JWT_TOKEN = 'mock-jwt-token-123'; // NOSONAR

  const mockAuthResponse: AuthResponse = {
    token: TEST_MOCK_JWT_TOKEN,
    id: 'user-id-123',
    username: TEST_VALID_USERNAME,
    email: 'test@example.com'
  };

  beforeEach(async () => {
    const modalServiceSpy = jasmine.createSpyObj('ModalService', [
      'isOpen',
      'openModal',
      'closeModal',
      'switchModal'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    modalServiceSpy.isOpen.and.returnValue(true);
    modalServiceSpy.currentModal = { signal: () => 'login' } as any;

    await TestBed.configureTestingModule({
      imports: [LoginModalComponent, ReactiveFormsModule],
      providers: [
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize login form with empty values', () => {
      expect(component.loginForm.get('username')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should initialize with no error message', () => {
      expect(component.errorMessage).toBeNull();
    });

    it('should initialize with loading false', () => {
      expect(component.loading).toBeFalse();
    });
  });

  describe('Form Validation', () => {
    it('should require username', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.hasError('required')).toBeTrue();
    });

    it('should validate username min length (3 characters)', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue(TEST_INVALID_USERNAME_SHORT);
      expect(usernameControl?.hasError('minlength')).toBeTrue();

      usernameControl?.setValue(TEST_VALID_USERNAME);
      expect(usernameControl?.hasError('minlength')).toBeFalse();
    });

    it('should require password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBeTrue();
    });

    it('should validate password min length (8 characters)', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue(TEST_INVALID_PASSWORD_SHORT);
      expect(passwordControl?.hasError('minlength')).toBeTrue();

      passwordControl?.setValue(TEST_VALID_PASSWORD);
      expect(passwordControl?.hasError('minlength')).toBeFalse();
    });

    it('should mark form as invalid when username is too short', () => {
      component.loginForm.patchValue({
        username: TEST_INVALID_USERNAME_SHORT,
        password: TEST_VALID_PASSWORD
      });
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should mark form as invalid when password is too short', () => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_INVALID_PASSWORD_SHORT
      });
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should mark form as valid with valid inputs', () => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should not submit form when form is invalid', () => {
      component.loginForm.patchValue({
        username: TEST_INVALID_USERNAME_SHORT,
        password: TEST_INVALID_PASSWORD_SHORT
      });

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should submit form when form is valid', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      authService.login.and.returnValue(of(mockAuthResponse));

      component.onSubmit();
      tick();

      expect(authService.login).toHaveBeenCalledWith({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      expect(component.loading).toBeFalse();
    }));

    it('should set loading to true during submission', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      // Use delay to ensure loading is checked before observable resolves
      authService.login.and.returnValue(of(mockAuthResponse).pipe(delay(100)));

      component.onSubmit();
      // Check immediately after onSubmit (before observable resolves)
      expect(component.loading).toBeTrue();

      // Then let it complete
      tick(100);
      expect(component.loading).toBeFalse();
    }));

    it('should clear error message on successful submission', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      component.errorMessage = 'Previous error';
      authService.login.and.returnValue(of(mockAuthResponse));

      component.onSubmit();
      expect(component.errorMessage).toBeNull();

      tick();
    }));

    it('should close modal on successful login', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      authService.login.and.returnValue(of(mockAuthResponse));

      component.onSubmit();
      tick();

      expect(modalService.closeModal).toHaveBeenCalled();
    }));
  });

  describe('Error Handling', () => {
    it('should handle login error and display error message', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      const errorResponse = {
        error: { message: 'Invalid credentials' },
        status: 401
      };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();
      tick();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Invalid credentials');
    }));

    it('should handle login error without error message', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      const errorResponse = { status: 500 };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();
      tick();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Login failed. Please check your credentials.');
    }));

    it('should handle network error', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      authService.login.and.returnValue(throwError(() => new Error('Network error')));

      component.onSubmit();
      tick();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Login failed. Please check your credentials.');
    }));

    it('should handle 400 Bad Request error', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      const errorResponse = {
        error: { message: 'Username is required' },
        status: 400
      };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();
      tick();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Username is required');
    }));

    it('should handle 401 Unauthorized error', fakeAsync(() => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      const errorResponse = {
        error: { message: 'Invalid username or password' },
        status: 401
      };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();
      tick();

      expect(component.loading).toBeFalse();
      expect(component.errorMessage).toBe('Invalid username or password');
    }));
  });

  describe('Modal Management', () => {
    it('should switch to register modal', () => {
      component.switchToRegister();
      expect(modalService.switchModal).toHaveBeenCalledWith('login', 'register');
    });

    it('should close modal', () => {
      component.close();
      expect(modalService.closeModal).toHaveBeenCalled();
    });

    it('should reset form when modal closes', () => {
      component.loginForm.patchValue({
        username: TEST_VALID_USERNAME,
        password: TEST_VALID_PASSWORD
      });
      component.errorMessage = 'Some error';
      component.loading = true;

      // Simulate modal closing by setting isOpen to false (triggers effect)
      (modalService.isOpen as jasmine.Spy).and.returnValue(false);
      component.isOpen = false;
      // Manually trigger resetForm (which is called by effect when isOpen becomes false)
      component['resetForm']();

      expect(component.loginForm.get('username')?.value).toBeNull();
      expect(component.loginForm.get('password')?.value).toBeNull();
      expect(component.errorMessage).toBeNull();
      expect(component.loading).toBeFalse();
    });
  });

  describe('Form Control Getters', () => {
    it('should return username form control', () => {
      expect(component.username).toBe(component.loginForm.get('username'));
    });

    it('should return password form control', () => {
      expect(component.password).toBe(component.loginForm.get('password'));
    });
  });
});
