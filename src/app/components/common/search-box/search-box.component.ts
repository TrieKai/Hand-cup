import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: false }) searchInputRef: ElementRef;
  @ViewChild('searchButton', { static: false }) searchButtonRef: ElementRef;
  @Output() doSearch = new EventEmitter();
  @Input() disable: boolean;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.disable) {
      this.renderer.addClass(this.searchButtonRef.nativeElement, 'disable');
    }
  }

  search() {
    if (this.disable) { return; }
    this.doSearch.emit(this.searchInputRef);
  }
}
