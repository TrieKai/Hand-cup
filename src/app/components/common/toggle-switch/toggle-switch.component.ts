import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  @Output() statusEmitter = new EventEmitter<boolean>();
  @Input() status: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  switch(status: boolean) {
    this.statusEmitter.emit(status);
  }
}
