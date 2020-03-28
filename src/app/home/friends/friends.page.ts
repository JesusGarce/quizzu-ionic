import { Component } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss', '../../app.component.scss']
})
export class FriendsPage {
  isItemAvailable = false;
  items: string[];

  constructor() {}

  initializeItems() {
    this.items = ['Ram', 'gopi', 'dravid'];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.isItemAvailable = true;
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }
}
