import {Directive, ElementRef, Host, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[Highlight]',
  standalone: false
})
export class HighlightDirective {
  @Input() Highlight: string = '#cdb38b';

  constructor(private ref:ElementRef) { }


  @HostListener('mouseenter') onMouseEnter(){
    this.applyHighlight(this.Highlight);
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.applyHighlight('');
  }
  private applyHighlight(backgroundColor: string) {
    this.ref.nativeElement.style.backgroundColor = backgroundColor;
    this.ref.nativeElement.style.transition = 'background-color 0.3s, color 0.3s';
    this.ref.nativeElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.8)';
  }
}
