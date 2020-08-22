import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit {
  originalFile: File = null;

  constructor() { }

  ngOnInit() {
  }

  selectImage(event: any) {
    console.log(event)
    if (event.target.files.length < 1) { return; }
    if (event.target.files[0].type.indexOf('image') < 0) { return; }
    this.originalFile = event.target.files[0];
    // const imageRef = this.ele.nativeElement.querySelector('#image');
    // if (this.isIEBrowser) {
    //   imageRef.style.width = '100%';
    //   imageRef.style.height = 'auto';
    // }
    // imageRef.src = URL.createObjectURL(this.originalFile);
    event.target.value = null;
  }
}
