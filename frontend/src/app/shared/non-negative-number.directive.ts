import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[type=number][appNonNegativeNumber]',
})
export class NonNegativeNumberDirective {
  readonly minValue = input(0, { alias: 'appNonNegativeNumber' });

  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly control = inject(NgControl, { optional: true });

  @HostListener('keydown', ['$event'])
  preventNegativeKeys(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  preventNegativePaste(event: ClipboardEvent): void {
    const pastedValue = event.clipboardData?.getData('text') ?? '';

    if (pastedValue.includes('-')) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  normalizeNegativeValue(): void {
    const inputElement = this.element.nativeElement;
    const value = Number(inputElement.value);

    if (!inputElement.value || Number.isNaN(value) || value >= 0) {
      return;
    }

    const min = this.minValue();
    inputElement.value = String(min);
    this.control?.control?.setValue(min);
    this.control?.control?.markAsTouched();
  }
}
