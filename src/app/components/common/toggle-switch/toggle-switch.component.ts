import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit, OnChanges {
  @ViewChild('checkbox', { static: false }) checkboxRef: ElementRef;
  @Output() statusEmitter = new EventEmitter<boolean>();
  @Input() status: boolean = false;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.checkboxRef) {
      if (changes.status.currentValue === null) {
        this.renderer.setAttribute(this.checkboxRef.nativeElement, 'disabled', 'true');
      } else {
        this.renderer.removeAttribute(this.checkboxRef.nativeElement, 'disabled');
      }
    }
  }

  ngOnInit() {
  }

  switch(status: boolean) {
    this.statusEmitter.emit(status);
  }
}
