import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('image', { static: false }) imageRef: ElementRef<HTMLImageElement>;
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('zoomSlider', { static: true }) zoomSlider: ElementRef<HTMLInputElement>;
  @ViewChild('rotateSlider', { static: true }) rotateSlider: ElementRef<HTMLInputElement>;
  @Output() output = new EventEmitter();
  originalFile: File = null;
  width: number = 300;
  height: number = 300;
  imageAng: number = 0;
  magnification: number = 1;
  imageDragPos = { newPosX: 0, newPosY: 0, posX: 0, posY: 0 };
  dragEnabled = false;
  zoomValue: string | number;
  rotateValue: string | number;

  @HostListener('document:mousemove', ['$event'])
  onMove(e: any) {
    if (!this.dragEnabled) { return; }
    this.dragging(e);
  }

  @HostListener('document:mouseup')
  async onDrop() { this.dragEnabled = false; }

  constructor() { }

  ngOnInit() {
    this.zoomValue = this.zoomSlider.nativeElement.value;
  }

  ngAfterViewInit() {
    this.initUI();
  }

  ngOnDestroy() {
  }

  private initUI() {
    this.canvasRef.nativeElement.width = this.width;
    this.canvasRef.nativeElement.height = this.height;
  }

  async selectImage(event: any) {
    console.log(event)
    if (event.target.files.length < 1) { return; }
    if (event.target.files[0].type.indexOf('image') < 0) { return; }
    this.originalFile = event.target.files[0];
    // if (this.isIEBrowser) {
    //   this.imageRef.nativeElement.width = '100%';
    //   this.imageRef.nativeElement.height = 'auto';
    // }
    // this.output.emit(this.originalFile);
    this.imageRef.nativeElement.src = URL.createObjectURL(this.originalFile);
    event.target.value = null;
  }

  imageOnload() {
    this.resetImage(); // Initial image
  }

  resetImage() {
    this.initImage();
    this.setImageCenter();

    this.zoomSlider.nativeElement.value = '0';
    this.zoomValue = '0';
    this.rotateSlider.nativeElement.value = '0';
    this.rotateValue = '0';
    this.imageAng = 0;
  }

  // Drag start
  onDrag(e: any) {
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

  dragging(e: any) {
    const image = this.imageRef.nativeElement;
    this.imageDragPos.newPosX = this.imageDragPos.posX - e.clientX;
    this.imageDragPos.newPosY = this.imageDragPos.posY - e.clientY;
    this.imageDragPos.posX = e.clientX;
    this.imageDragPos.posY = e.clientY;
    image.style.left = (image.offsetLeft - this.imageDragPos.newPosX) + 'px';
    image.style.top = (image.offsetTop - this.imageDragPos.newPosY) + 'px';
  }

  private initImage() {
    const image = this.imageRef.nativeElement;
    const imageScale = image.naturalHeight / image.naturalWidth;
    if (image.naturalWidth > image.naturalHeight) {
      image.width = this.height / imageScale;
      image.height = this.height;
    } else if (image.naturalWidth < image.naturalHeight) {
      image.width = this.width;
      image.height = this.width * imageScale;
    } else {
      image.width = this.width;
      image.height = this.height;
    }
  }

  private setImageCenter() {
    const image = this.imageRef.nativeElement;
    // Make image position center
    image.style.left = (-image.width / 2) + (this.width / 2) + 'px';
    image.style.top = (-image.height / 2) + (this.height / 2) + 'px';
    // Make image angle initial
    image.style.transform = 'rotate(0deg)';
  }

  zoom(value: number) {
    this.zoomValue = value > 0 ? '+' + value : value;
    this.magnification = 1 + (value / 100);
    const image = this.imageRef.nativeElement;
    const originimageWidth = image.width;
    const originimageHeight = image.height;

    this.initImage();

    // Set image width & height
    image.width = image.width * this.magnification;
    image.height = image.height * this.magnification;

    // Set image position
    const ratio = image.width / originimageWidth;
    if (ratio > 1) {
      image.style.left = Number(image.style.left.slice(0, -2)) - (image.width - originimageWidth) / 2 + 'px';
      image.style.top = Number(image.style.top.slice(0, -2)) - (image.height - originimageHeight) / 2 + 'px';
    } else {
      image.style.left = Number(image.style.left.slice(0, -2)) + (originimageWidth - image.width) / 2 + 'px';
      image.style.top = Number(image.style.top.slice(0, -2)) + (originimageHeight - image.height) / 2 + 'px';
    }
  }

  rotate(value: number) {
    this.imageAng = value;
    this.rotateValue = value > 0 ? '+' + value : value;
    const image = this.imageRef.nativeElement;
    image.style.transform = 'rotate(' + value + 'deg)';
  }

  private renderCanvas() {
    const image = this.imageRef.nativeElement;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.arc(this.width / 2, this.height / 2, this.width / 2, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.translate(image.offsetLeft, image.offsetTop); // Translate to position how far we move it
    ctx.translate(image.width / 2, image.height / 2); // Translate to image center for rotate at center
    ctx.rotate(this.imageAng * Math.PI / 180); // Rotate
    ctx.translate(-image.width / 2, -image.height / 2); // Back to original position
    ctx.drawImage(image, 0, 0, image.width, image.height); // Draw image
    ctx.restore();
  }

  async cropImage(): Promise<File> {
    this.renderCanvas();
    const dataURL = this.canvasRef.nativeElement.toDataURL();
    return await this.url2File(dataURL).then((image) => {
      return image;
    });
  }

  private async url2File(url: string) {
    return (fetch(url)
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((buffer) => {
        return new File([buffer], this.originalFile.name, { type: this.originalFile.type });
      }));
  }
}
