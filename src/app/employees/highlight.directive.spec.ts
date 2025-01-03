import { HighlightDirective } from './highlight.directive';
import { ElementRef } from '@angular/core';

describe('HighlightDirective', () => {
  let directive: HighlightDirective;
  let mockElementRef: ElementRef;

  beforeEach(() => {
    mockElementRef = { nativeElement: document.createElement('div') };
    directive = new HighlightDirective(mockElementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should apply background color on mouse enter', () => {
    directive.Highlight = '#cdb38b';
    directive.onMouseEnter();
    expect(mockElementRef.nativeElement.style.backgroundColor).toBe('#cdb38b');
  });

  it('should remove background color on mouse leave', () => {
    directive.onMouseLeave();
    expect(mockElementRef.nativeElement.style.backgroundColor).toBe('');
  });
});
