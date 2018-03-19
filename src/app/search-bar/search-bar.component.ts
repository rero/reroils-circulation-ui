import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'reroils-circulation-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  @Input() placeholder: string;
  @Output() onSearch = new EventEmitter<string>();
  @Input() searchText: string;

  search(searchText: string) {
    this.onSearch.emit(searchText);
  }
}
