import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Searchbar component
 */
@Component({
  selector: 'reroils-circulation-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  @Input() placeholder: string;
  @Output() search = new EventEmitter<string>();
  @Input() searchText: string;

  doSearch(searchText: string) {
    this.search.emit(searchText);
  }
}
