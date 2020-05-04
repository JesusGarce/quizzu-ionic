import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable()
export class ToastService {

    constructor(public toastCtrl: ToastController) {
    }

    create(message, ok = false, duration = 3000) {
        this.toastCtrl.create({
            message,
            duration: ok ? null : duration,
            position: 'top',
            color: 'primary',
            animated: true
        }).then(toast => toast.present());
    }
}
