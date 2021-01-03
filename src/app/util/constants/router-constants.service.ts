import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RouterConstantsService {
    public static readonly ROUTER_HOME: string = 'home';
    public static readonly ROUTER_AUTHEMAIL: string = 'auth-email';
    public static readonly ROUTER_MAP: string = 'map';
    public static readonly ROUTER_DRINKSHOP: string = 'drinkShop';
    public static readonly ROUTER_DRINK: string = 'drink';
    public static readonly ROUTER_MYMAP: string = 'myMap';
}
