import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { ImagePreview } from '../image-preview/image-preview';

@Component({
  selector: 'app-upload-box',
  imports: [MatButtonModule, ImagePreview],
  templateUrl: './upload-box.html',
  styleUrl: './upload-box.scss',
})
export class UploadBox {
  readonly accept = input('image/*,.pdf,.doc,.docx,.txt');
  readonly multiple = input(true);
  readonly label = input('Arraste arquivos aqui');
  readonly hint = input('Imagens, documentos e bilhetes');
  readonly filesSelected = output<File[]>();

  readonly files = signal<File[]>([]);
  readonly dragging = signal(false);

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(input.files);
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.addFiles(event.dataTransfer?.files ?? null);
  }

  removeFile(index: number): void {
    const files = this.files().filter((_, itemIndex) => itemIndex !== index);
    this.files.set(files);
    this.filesSelected.emit(files);
  }

  private addFiles(fileList: FileList | null): void {
    if (!fileList?.length) {
      return;
    }

    const incoming = Array.from(fileList);
    const files = this.multiple() ? [...this.files(), ...incoming] : incoming.slice(0, 1);

    this.files.set(files);
    this.filesSelected.emit(files);
  }
}
