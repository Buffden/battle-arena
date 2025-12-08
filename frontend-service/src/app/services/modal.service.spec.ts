import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;
  let originalBodyOverflow: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
    // Save original body overflow style
    originalBodyOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    // Restore original body overflow style
    document.body.style.overflow = originalBodyOverflow;
  });

  describe('isOpen()', () => {
    it('should return false when no modal is open', () => {
      expect(service.isOpen('login')).toBeFalse();
      expect(service.isOpen('register')).toBeFalse();
      expect(service.isOpen(null)).toBeTrue(); // null means no modal
    });

    it('should return true when login modal is open', () => {
      service.openModal('login');
      expect(service.isOpen('login')).toBeTrue();
      expect(service.isOpen('register')).toBeFalse();
    });

    it('should return true when register modal is open', () => {
      service.openModal('register');
      expect(service.isOpen('register')).toBeTrue();
      expect(service.isOpen('login')).toBeFalse();
    });

    it('should return false after closing modal', () => {
      service.openModal('login');
      expect(service.isOpen('login')).toBeTrue();

      service.closeModal();
      expect(service.isOpen('login')).toBeFalse();
      expect(service.isOpen('register')).toBeFalse();
    });
  });

  describe('getCurrentModal()', () => {
    it('should return null when no modal is open', () => {
      expect(service.getCurrentModal()).toBeNull();
    });

    it('should return login when login modal is open', () => {
      service.openModal('login');
      expect(service.getCurrentModal()).toBe('login');
    });

    it('should return register when register modal is open', () => {
      service.openModal('register');
      expect(service.getCurrentModal()).toBe('register');
    });

    it('should return null after closing modal', () => {
      service.openModal('login');
      service.closeModal();
      expect(service.getCurrentModal()).toBeNull();
    });
  });

  describe('openModal()', () => {
    it('should open login modal and prevent body scroll', () => {
      service.openModal('login');
      expect(service.getCurrentModal()).toBe('login');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should open register modal and prevent body scroll', () => {
      service.openModal('register');
      expect(service.getCurrentModal()).toBe('register');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should replace existing modal when opening new one', () => {
      service.openModal('login');
      expect(service.getCurrentModal()).toBe('login');

      service.openModal('register');
      expect(service.getCurrentModal()).toBe('register');
      expect(service.isOpen('login')).toBeFalse();
    });
  });

  describe('closeModal()', () => {
    it('should close modal and restore body scroll', () => {
      service.openModal('login');
      expect(document.body.style.overflow).toBe('hidden');

      service.closeModal();
      expect(service.getCurrentModal()).toBeNull();
      expect(document.body.style.overflow).toBe('');
    });

    it('should handle closing when no modal is open', () => {
      expect(service.getCurrentModal()).toBeNull();
      service.closeModal();
      expect(service.getCurrentModal()).toBeNull();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('switchModal()', () => {
    it('should switch from login to register', () => {
      service.openModal('login');
      service.switchModal('login', 'register');
      expect(service.getCurrentModal()).toBe('register');
      expect(service.isOpen('login')).toBeFalse();
    });

    it('should switch from register to login', () => {
      service.openModal('register');
      service.switchModal('register', 'login');
      expect(service.getCurrentModal()).toBe('login');
      expect(service.isOpen('register')).toBeFalse();
    });

    it('should switch from null to login', () => {
      service.switchModal(null, 'login');
      expect(service.getCurrentModal()).toBe('login');
    });

    it('should switch from login to null', () => {
      service.openModal('login');
      service.switchModal('login', null);
      expect(service.getCurrentModal()).toBeNull();
    });
  });

  describe('currentModalSignal', () => {
    it('should be readonly and reflect current modal state', () => {
      expect(service.currentModalSignal()).toBeNull();

      service.openModal('login');
      expect(service.currentModalSignal()).toBe('login');

      service.closeModal();
      expect(service.currentModalSignal()).toBeNull();
    });
  });
});
