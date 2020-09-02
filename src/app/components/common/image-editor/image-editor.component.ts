import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('image', { static: false }) imageRef: ElementRef<HTMLImageElement>;
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('zoomSlider', { static: true }) zoomSlider: ElementRef<HTMLInputElement>;
  @Output() output = new EventEmitter();
  originalFile: File = null;
  width: number = 300;
  height: number = 300;
  imageDeg = 0;
  imagePosX = 0;
  imagePosY = 0;
  magnification: number = 1;
  imageDragPos = { newPosX: 0, newPosY: 0, posX: 0, posY: 0 };
  dragEnabled = false;
  subscribe: Subscription;
  zoomValue: string;

  @HostListener('document:mousemove', ['$event'])
  onMove(e: any) {
    if (!this.dragEnabled) { return; }
    this.dragging(e);
  }

  @HostListener('document:mouseup')
  async onDrop() { this.dragEnabled = false; }

  constructor(
    private sharedService: SharedService,
    private cons: ConstantsService,
  ) { }

  ngOnInit() {
    this.zoomValue = this.zoomSlider.nativeElement.value;
  }

  ngAfterViewInit() {
    this.initUI();
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
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
    console.log(this.imageRef.nativeElement.offsetLeft, this.imageRef.nativeElement.offsetHeight, this.imageRef.nativeElement.style.left, this.imageRef.nativeElement.style.top)
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

    // this.calculatePos(image.offsetLeft - this.imageDragPos.newPosX, image.offsetTop - this.imageDragPos.newPosY);
  }

  // calculatePos(x: number, y: number) {
  //   if (this.imageDeg === 0 || this.imageDeg === 180) {
  //     this.imagePosX = x;
  //     this.imagePosY = y;
  //   } else {
  //     const image = this.imageRef.nativeElement;
  //     this.imagePosX = (image.width - image.height) / 2 * this.magnification + x;
  //     this.imagePosY = (image.height - image.width) / 2 * this.magnification + y;
  //   }
  // }

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
  }

  zoom(value: number) {
    this.zoomValue = value > 0 ? '+' + value : stringify(value);
    this.magnification = 1 + (value / 100);
    console.log('magnification: ', this.magnification)

    this.initImage();
    const image = this.imageRef.nativeElement;
    image.width = image.width * this.magnification;
    image.height = image.height * this.magnification;
    console.log(image.offsetLeft, image.offsetHeight, image.style.left, image.style.top)

    // image.style.left = Number(image.style.left.slice(0, -2)) + ((Number(image.style.left.slice(0, -2)) * -(this.magnification - 1)) / 2) + 'px';
    // image.style.top = Number(image.style.top.slice(0, -2)) + ((Number(image.style.top.slice(0, -2)) * -(this.magnification - 1)) / 2) + 'px';
  }

  private renderCanvas() {
    const image = this.imageRef.nativeElement;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.arc(this.width / 2, this.height / 2, this.width / 2, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.drawImage(image, image.offsetLeft, image.offsetTop, image.width, image.height);
    // ctx.save();
    // ctx.translate(image.offsetLeft - this.imageDragPos.newPosX, image.offsetTop - this.imageDragPos.newPosY);
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
