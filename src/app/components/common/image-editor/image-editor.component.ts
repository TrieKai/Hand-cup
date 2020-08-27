import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit {
  @ViewChild('image', { static: false }) imageRef: ElementRef;
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  @Output() output = new EventEmitter();
  originalFile: File = null;
  width: number = 250;
  height: number = 250;
  imageDragPos = { newPosX: 0, newPosY: 0, posX: 0, posY: 0 };
  dragEnabled = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initUI();
  }

  private initUI() {
    this.canvasRef.nativeElement.width = this.width;
    this.canvasRef.nativeElement.height = this.height;
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
    this.output.emit(this.originalFile);
    this.imageRef.nativeElement.src = URL.createObjectURL(this.originalFile);
    event.target.value = null;
  }

  onDrag(e: any) {
    console.log(e)
    e.preventDefault();
    this.dragElement(e);
  }

  onDragMobile(e: any) {
    document.body.style.overflow = 'hidden';
    this.dragElement(e);
  }

  private dragElement(e: any) {
    this.imageDragPos.posX = e.clientX;
    this.imageDragPos.posY = e.clientY;
    this.dragEnabled = true;
  }

  async cropImage(): Promise<File> {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    ctx.rect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    ctx.fillStyle = '#eeeeee';
    ctx.fill();

    const dataURL = this.canvasRef.nativeElement.toDataURL();
    let file: File;
    await this.url2File(dataURL).then((image) => {
      file = image;
      this.output.emit(image);
    });
    return file;
  }

  private url2File(url: string) {
    return (fetch(url).then((res) => {
      return res.arrayBuffer();
    }).then((buffer) => {
      return new File([buffer], this.originalFile.name, { type: this.originalFile.type });
    }));
  }
}
