import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appInputSearch]'
})
export class InputSearchDirective implements AfterViewInit, OnDestroy {
  private observer: MutationObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const nativeElement = this.el.nativeElement;

    this.observer = new MutationObserver(() => {
      const searchInput = nativeElement.querySelector('.e-search input');

      const ej2Instances = (nativeElement as any)['ej2_instances'];
      if (ej2Instances && ej2Instances.length > 0 && searchInput) {
        const gridInstance = ej2Instances[0];

        searchInput.addEventListener('input', (event: any) => {
          const query = event.target.value;
          gridInstance.search(query);
        });

        // ✅ Stop observing once input is found and bound
        this.observer.disconnect();
        console.log('✅ Search input event bound successfully');
      }
    });

    this.observer.observe(nativeElement, {
      childList: true,
      subtree: true
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
