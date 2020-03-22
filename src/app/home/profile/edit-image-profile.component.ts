import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import {AuthenticationService} from '../../shared/authentication-service';

@Component({
    selector: 'app-settings',
    templateUrl: './edit-image-profile.component.html',
    styleUrls: ['../../app.component.scss']
})
export class EditImageProfileComponent implements OnInit {
    constructor(
        private popoverController: PopoverController,
        private authService: AuthenticationService) {
    }

    ngOnInit() {}

    imageSelected(event) {
        this.authService.onProfileUpload(event);
        this.popoverController.dismiss();
    }

    presentUploadImage(fileLoader) {
        fileLoader.click();
    }

}
