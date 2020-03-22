import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {SpinnerLoadingComponent} from './spinner-loading.component';

@Injectable({
    providedIn: 'root'
})
export class SpinnerLoadingService {
    private overlayRef: OverlayRef = null;

    constructor(private overlay: Overlay) {}

    public show(message = '') {
        if (!this.overlayRef) {
            this.overlayRef = this.overlay.create();
        }

        const spinnerOverlayPortal = new ComponentPortal(SpinnerLoadingComponent);
        const component = this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
    }

    public hide() {
        if (!!this.overlayRef) {
            this.overlayRef.detach();
        }
    }
}
