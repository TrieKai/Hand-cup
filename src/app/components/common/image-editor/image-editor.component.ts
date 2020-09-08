import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener, Renderer2, Input } from '@angular/core';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('imageEditor', { static: true }) imageEditor: ElementRef<HTMLCanvasElement>;
  @ViewChild('image', { static: true }) imageRef: ElementRef<HTMLImageElement>;
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('zoomSlider', { static: true }) zoomSlider: ElementRef<HTMLInputElement>;
  @ViewChild('rotateSlider', { static: true }) rotateSlider: ElementRef<HTMLInputElement>;
  @ViewChild('opacitySlider', { static: true }) opacitySlider: ElementRef<HTMLInputElement>;
  @Input() photoURL: string;
  @Output() imageOnloaded = new EventEmitter();
  originalFile: File = null;
  width: number = 300;
  height: number = 300;
  magnification: number = 1;
  imageDragPos = { newPosX: 0, newPosY: 0, posX: 0, posY: 0 };
  dragEnabled = false;
  zoomValue: string | number;
  rotateValue: string | number;
  opacityValue: string | number;

  @HostListener('document:mousemove', ['$event'])
  onMove(e: any) {
    if (!this.dragEnabled) { return; }
    this.dragging(e);
  }

  @HostListener('document:touchmove', ['$event'])
  onMoveMobile(e: any) {
    if (!this.dragEnabled) { return; }
    this.dragging(e.targetTouches[0]);
  }

  @HostListener('document:mouseup')
  onDrop() { this.dragEnabled = false; }

  @HostListener('document:touchend')
  onDropMobile() {
    document.body.style.overflow = 'auto';
    this.dragEnabled = false;
  }

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.zoomValue = this.zoomSlider.nativeElement.value;
    this.rotateValue = this.rotateSlider.nativeElement.value;
    this.opacityValue = this.opacitySlider.nativeElement.value;
  }

  ngAfterViewInit() {
    this.initUI();
  }

  ngOnDestroy() {
  }

  private initUI() {
    // If this user has photo
    if (this.photoURL !== '' && this.photoURL !== null && this.photoURL !== undefined) {
      this.imageRef.nativeElement.src = this.photoURL;
      this.renderer.addClass(this.imageEditor.nativeElement, 'grab');
    }
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
    this.imageRef.nativeElement.src = URL.createObjectURL(this.originalFile);
    event.target.value = null;
  }

  imageOnload() {
    this.resetImage(); // Initial image
    this.imageOnloaded.emit(true);
    this.renderer.addClass(this.imageEditor.nativeElement, 'grab');
  }

  resetImage() {
    this.initImage();
    this.initZoom();
    this.initRotate();
    this.initOpacity();
    this.setImageCenter();
  }

  resetValue(type: string) {
    switch (type) {
      case 'zoom':
        this.initImage();
        this.initZoom();
        this.setImageCenter();
        break;
      case 'rotate':
        this.initRotate();
        break;
      case 'opacity':
        this.initOpacity();
        break;
    }
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

  private initZoom() {
    this.zoomSlider.nativeElement.value = '0';
    this.zoomValue = '0';
  }

  private initRotate() {
    this.imageRef.nativeElement.style.transform = 'rotate(0deg)';

    this.rotateSlider.nativeElement.value = '0';
    this.rotateValue = '0';
  }

  private initOpacity() {
    this.imageRef.nativeElement.style.opacity = '1';

    this.opacitySlider.nativeElement.value = '1';
    this.opacityValue = '1';
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
    if (!this.imageRef.nativeElement.src) { return; }
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

  private setImageCenter() {
    const image = this.imageRef.nativeElement;
    // Make image position center
    image.style.left = (-image.width / 2) + (this.width / 2) + 'px';
    image.style.top = (-image.height / 2) + (this.height / 2) + 'px';
  }

  zoom(value: number) {
    this.zoomValue = value > 0 ? '+' + value : value;
    if (!this.imageRef.nativeElement.src) { return; }
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

  rotate(value: string) {
    this.rotateValue = Number(value) > 0 ? '+' + value : value;
    if (!this.imageRef.nativeElement.src) { return; }
    const image = this.imageRef.nativeElement;
    image.style.transform = 'rotate(' + value + 'deg)';
  }

  opacity(value: string) {
    this.opacityValue = value;
    if (!this.imageRef.nativeElement.src) { return; }
    this.imageRef.nativeElement.style.opacity = value;
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
    ctx.rotate(Number(this.rotateValue) * Math.PI / 180); // Rotate
    ctx.translate(-image.width / 2, -image.height / 2); // Back to original position
    ctx.globalAlpha = Number(this.opacityValue); // Set opacity
    try {
      ctx.drawImage(image, 0, 0, image.width, image.height); // Draw image
    } catch (e) {
      Error(e);
    }
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
        return new File(
          [buffer],
          this.originalFile.name,
          { type: this.originalFile.type ? this.originalFile.type : 'image/png' }
        );
      }));
  }
}
