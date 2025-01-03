import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: false
})
export class FormatDatePipe implements PipeTransform {

  transform(value: Date): string {
    const date = new Date(value)
    return date.toLocaleDateString('en-US',{ day: 'numeric' , month: 'long',year: 'numeric'});
  }

}
