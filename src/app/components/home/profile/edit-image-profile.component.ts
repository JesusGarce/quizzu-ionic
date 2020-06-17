import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {UserService} from '../../../shared/services/user-service';

@Component({
    selector: 'app-settings',
    templateUrl: './edit-image-profile.component.html',
    styleUrls: ['../../../app.component.scss']
})
export class EditImageProfileComponent implements OnInit {
    constructor(
        private popoverController: PopoverController,
        private userService: UserService) {
    }

    ngOnInit() {
    }

    imageSelected(event) {
        this.userService.onProfileUpload(event);
        this.popoverController.dismiss();
    }

    presentUploadImage(fileLoader) {
        fileLoader.click();
    }

}
