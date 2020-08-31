import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/shared/shared.service';
import { ConstantsService } from 'src/app/util/constants/constants.service';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('image', { static: false }) imageRef: ElementRef<HTMLImageElement>;
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  @Output() output = new EventEmitter();
  originalFile: File = null;
  width: number = 300;
  height: number = 300;
  imageDeg = 0;
  imagePosX = 0;
  imagePosY = 0;
  magnification = 1;
  imageDragPos = { newPosX: 0, newPosY: 0, posX: 0, posY: 0 };
  dragEnabled = false;
  subscribe: Subscription;
  // outputCanvas: boolean;

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
    this.subscribe = this.sharedService.onInitEmitted.subscribe(() => {
      const outputCanvas = this.sharedService.getSharedData(this.cons.SHAREDDATA.outputCanvas);
      if (outputCanvas) {
        this.renderCanvas();
        const outputImage = this.cropImage();
        this.output.emit(outputImage);
      }
    });
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
    // this.imageRef.nativeElement.width = 0;
    // this.imageRef.nativeElement.height = 0;
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

  async imageOnload() {
    this.resetImage(); // Initial image
  }

  // TODO: Fix reset image
  resetImage() {
    const image = this.imageRef.nativeElement;
    const imageScale = image.height / image.width;
    // console.log('ooooooo', image.width, image.height)
    if (image.width > image.height) {
      image.height = this.height;
      image.width = image.height / imageScale;
    } else if (image.width < image.height) {
      image.width = this.width;
      image.height = image.width * imageScale;
    } else {
      image.width = this.width;
      image.height = this.height;
    }

    // Make image position center
    image.style.left = (-image.width / 2) + (this.width / 2) + 'px';
    image.style.top = (-image.height / 2) + (this.height / 2) + 'px';
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
    const dataURL = this.canvasRef.nativeElement.toDataURL();
    let file: File;
    await this.url2File(dataURL).then((image) => {
      file = image;
      this.output.emit(image);
    });
    return file;
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
