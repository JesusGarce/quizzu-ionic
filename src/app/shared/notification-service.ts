import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Notification} from './notification.model';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    notificationList: Notification[];

    constructor(
        public afStore: AngularFirestore,
        public router: Router,
        private localNotifications: LocalNotifications,
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
                }
                return this.notificationList;
            });

    }

    createNotification(title, message, userId) {
        const notification = new Notification('', title, message, userId);
        console.log(notification);
        return this.afStore.doc(`users/${userId}`).ref.get().then(user => {
            if (user.exists) {
                const userData = user.data();
                console.log('Create notification');
                console.log(userData.notifEnabled);
                if (userData.notifEnabled) {
                    this.afStore.collection('notifications').add(JSON.parse(JSON.stringify(notification))).then();
                }
            }
        });
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
                    this.notificationList.push(new Notification(not.id, not.data().title, not.data().message, not.data().userId));
                    this.createLocalNotification(not.data().message);
                }
            }
        }, err => {});
    }

    createLocalNotification(message) {
        this.localNotifications.schedule({
            id: 1,
            text: message,
            data: { secret: 'secret' }
        });
    }

    getNotificationList() {
        return this.notificationList;
    }

    getNotificationListLength() {
        return this.notificationList.length;
    }

}
