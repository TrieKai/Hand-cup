import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit {
  @ViewChild('image', { static: false }) imageRef: ElementRef;
  @Output() image = new EventEmitter();
  originalFile: File = null;

  constructor() { }

  ngOnInit() {
  }

  selectImage(event: any) {
    console.log(event)
    if (event.target.files.length < 1) { return; }
    if (event.target.files[0].type.indexOf('image') < 0) { return; }
    this.originalFile = event.target.files[0];
    // if (this.isIEBrowser) {
    //   this.imageRef.nativeElement.width = '100%';
    //   this.imageRef.nativeElement.height = 'auto';
    // }
    this.image.emit(this.originalFile);
    this.imageRef.nativeElement.src = URL.createObjectURL(this.originalFile);
    event.target.value = null;
  }
}
