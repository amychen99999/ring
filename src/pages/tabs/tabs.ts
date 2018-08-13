import { Component } from '@angular/core'

import { FriendListController } from '../friends/friendList'
import { AroundListController } from '../around/aroundList'
import { ContactListController } from '../message/contactList'
import { SettingController } from '../setting/setting'
import { HomePage } from '../home/home';
import { ModalController } from 'ionic-angular';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsController {

    homePage = HomePage
    aroundListPage = AroundListController
    friendListPage = FriendListController
    contactListPage = ContactListController
    settingPage = SettingController

    constructor(public modalCtrl: ModalController) { }

    // isAroundClick():Boolean{
    //     console.log("iswork");
    //     return true;
    // }

    // goToPage(page) {
    //     console.log("iswork");
    //     let modal = this.modalCtrl.create(page);
    //     modal.present();
    //   }
    
}
