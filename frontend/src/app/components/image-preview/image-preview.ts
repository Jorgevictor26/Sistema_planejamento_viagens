import { Component, computed, input } from '@angular/core';

export interface ImagePreviewItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.html',
  styleUrl: './image-preview.scss',
})
export class ImagePreview {
  readonly files = input<File[]>([]);
  readonly images = input<ImagePreviewItem[]>([]);

  readonly previews = computed<ImagePreviewItem[]>(() => [
    ...this.images(),
    ...this.files()
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
  ]);
}
