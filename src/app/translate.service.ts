import { TranslateService } from '@ngx-translate/core';

export class TranslateStringService {

  constructor(private translate: TranslateService) {}

  public trans(string) {
    this.translate.get(string).subscribe(txt => {
      string = txt;
    });
    return string;
  }
}
