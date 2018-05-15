import { Component, TemplateRef, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

/**
 * Component for a modal dialog confirmation
 */
@Component({
  selector: 'reroils-circulation-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  public _content: string;
  @Output()
  public confirm = new EventEmitter<boolean>();
  @Input()
  set content(name: string) {
    this._content = name;
    if (name === undefined) {
      if (this.currentDialog !== null) {
        this.currentDialog.hide();
      }
    } else {
      this.currentDialog = this.modalService.show(this.dialogTpl, {class: 'modal-sm'});
    }
  }

  private modalRef: BsModalRef;
  // TODO: display the message in the template, but this cause an error
  private currentDialog = null;

  @ViewChild('template')
  private dialogTpl: TemplateRef<any>;

  constructor(private modalService: BsModalService) {
    this._content = undefined;
  }

  doConfirm(ok: boolean): void {
    this.confirm.emit(ok);
    if (this.currentDialog !== null) {
      this.currentDialog.hide();
    }
  }

}
