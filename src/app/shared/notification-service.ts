import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {SpinnerLoadingService} from './spinner-loading/spinner-loading.service';
import {ToastService} from './toast-service';
import {UserService} from './user-service';
import {AlertController, ModalController} from '@ionic/angular';
import {Notification} from './notification.model';
import {Messages} from './messages';
import {Match} from './match.model';
import {UserMin} from './user-min.model';

@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    notificationList: Notification[];

    constructor(
        public afStore: AngularFirestore,
        public router: Router,
        private spinnerLoading: SpinnerLoadingService,
        private toast: ToastService,
        private modalController: ModalController,
        private userService: UserService,
        private alertController: AlertController
    ) {
        this.notificationList = [];
    }

    getNotificationsByUserId(userId) {
        this.afStore.collection('notifications').ref
            .where('userId', '==', userId)
            .get()
            .then(notifications => {
                if (notifications.empty) {
                    return false;
                }
                for (const not of notifications.docs.values()) {
                    this.notificationList.push(new Notification(not.id, not.data().title, not.data().message, not.data().userId));
                    console.log(not.data());
                }
                return this.notificationList;
            });
    }

    createNotification(title, message, userId) {
        const notification = new Notification('', title, message, userId);

        return this.afStore.collection('notifications').add(JSON.parse(JSON.stringify(notification))).then();
    }

    deleteNotification(id) {
        return this.afStore.collection('notifications')
            .doc(id)
            .delete()
            .then( () => {
                this.notificationList = this.notificationList.filter( n => n.id !== id);
            });
    }

    deleteAllNotificationsByUser() {
        for (const notification of this.notificationList) {
            console.log(notification);
            this.afStore.collection('notifications')
                .doc(notification.id)
                .delete()
                .then( () => {
                    this.notificationList = this.notificationList.filter( n => n.id !== notification.id);
                });
        }
    }

    listeningNotification(userId) {
        const query = this.afStore.collection('notifications').ref.where('userId', '==', userId);
        return query.onSnapshot(querySnapshot => {
            for (const not of querySnapshot.docs.values()) {
                if (this.notificationList.find( n => n.id === not.id) === undefined) {
                    console.log(not.data());
                    this.notificationList.push(new Notification(not.id, not.data().title, not.data().message, not.data().userId));
                }
            }
        }, err => {});
    }

    getNotificationList() {
        return this.notificationList;
    }

    getNotificationListLength() {
        return this.notificationList.length;
    }

}
