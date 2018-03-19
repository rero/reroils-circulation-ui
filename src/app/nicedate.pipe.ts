import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'nicedate'
})
export class NicedatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment(value).format('LL');
  }

}
