import { Injectable, Injector, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, ComponentRef } from '@angular/core';

import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DomService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private sharedService: SharedService,
  ) { }

  createComponent(component: any, name: string, componentProps?: object) {
    // Create a component reference from the component 
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    if (componentProps && typeof componentRef.instance === 'object') {
      Object.assign(componentRef.instance as object, componentProps);
    }
    // Set componentRef into shared data service
    this.sharedService.setSharedComponent(name, componentRef);

    return componentRef;
  }

  attachComponent(componentRef: ComponentRef<any>, appendTo: Element) {
    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // Append DOM element to the body
    appendTo.appendChild(domElem);

    return;
  }

  destroyComponent(componentRef: ComponentRef<any>) {
    componentRef.destroy();
  }
}