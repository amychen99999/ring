import { Component, OnDestroy } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { FriendDetailController } from '../friends/friendDetail'

import { FirestoreService } from '../../services/firestoreService'
import { Admin, Member } from '../../angularModel'
import { Subscription } from 'rxjs'
import { NavController, App, ToastController } from 'ionic-angular';
import { ContactChatController } from '../message/contactChat';
import { MessageService } from '../../services/messageService';

@Component({
    selector: 'page-friendList',
    templateUrl: 'friendList.html'
})
export class FriendListController implements OnDestroy {
    friendDetailPage: any = FriendDetailController

    logged: Boolean = false
    friendsSubscription: Subscription
    adminSubscription: Subscription
    chatSubscription: Subscription
    admins = new Array<Admin>()
    friends = new Array<Member>()
    admin: Admin = null
    friendMember: Member

    constructor(private appCtrl: App, private firestoreService: FirestoreService, private messageService: MessageService, private toastCtrl: ToastController, angularfireAuth: AngularFireAuth, public navCtrl: NavController) {
        angularfireAuth.authState.subscribe(firebaseUser => {
            this.logged = !!firebaseUser
            if (this.logged) {
                this.friendsSubscription = firestoreService.getFriends(firebaseUser.uid).subscribe(friends => this.friends = friends)
                this.adminSubscription = firestoreService.getAdminByAccount(firebaseUser.uid).subscribe(admin => this.admin = admin)
            } else
                this.ngOnDestroy()
        })
    }

    ngOnDestroy() {
        if (this.friendsSubscription)
            this.friendsSubscription.unsubscribe()
        if (this.adminSubscription)
            this.adminSubscription.unsubscribe()
        if (this.chatSubscription)
            this.chatSubscription.unsubscribe()
        this.admins = []
        this.friends = []
    }

    goToPage(account) {
        this.navCtrl.push(this.friendDetailPage, account)
    }

    deleteFriend(friendAccount: string) {
        this.firestoreService.deleteFriend(this.admin.member.account, friendAccount)
        const toast = this.toastCtrl.create({
            message: '刪除成功!',
            duration: 2000
        });
        toast.present();
    }

    contactChat(account: string) {
        this.chatSubscription = this.firestoreService.getFriend(this.admin.account, account).subscribe(member => this.friendMember = member)
        this.messageService.addChatMember(this.admin.member, this.friendMember, true)
        console.log(this.friendMember)
        this.appCtrl.getRootNav().push(ContactChatController, account)
    }
}
