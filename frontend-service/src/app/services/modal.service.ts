import { Injectable, signal } from '@angular/core';

export type ModalType = 'login' | 'register' | null;

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly currentModal = signal<ModalType>(null);

  isOpen(modalType: ModalType): boolean {
    return this.currentModal() === modalType;
  }

  getCurrentModal(): ModalType {
    return this.currentModal();
  }

  openModal(modalType: ModalType): void {
    this.currentModal.set(modalType);
    // Prevent body scroll when modal is open (prevents background scrolling)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.currentModal.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  switchModal(from: ModalType, to: ModalType): void {
    this.currentModal.set(to);
  }

  readonly currentModalSignal = this.currentModal.asReadonly();
}
