// viewer.directive.ts
import { Directive, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';
import Viewer from 'viewerjs';

@Directive({
  selector: '[appViewer]'
})
export class ViewerDirective implements AfterViewInit, OnDestroy {
  @Input() viewerOptions: Viewer.Options = {};

  private viewerInstance!: Viewer;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.viewerInstance = new Viewer(this.el.nativeElement, {
      toolbar: {
              zoomOut: 1,

        reset: 1,
                zoomIn: 1,

        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 0,
        rotateRight: 0,
        flipHorizontal: 0,
        flipVertical: 0,
        download: 0,
      },
      navbar: false,
      ...this.viewerOptions
    });
  }

  ngOnDestroy(): void {
    if (this.viewerInstance) {
      this.viewerInstance.destroy();
    }
  }
}
