import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-image.component.html',
  styleUrl: './blog-image.component.css'
})
export class BlogImageComponent {
  @Input() imageSrc!: string;
  @Input() altText!: string;
}
