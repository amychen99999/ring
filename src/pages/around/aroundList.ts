import { Component, OnDestroy } from '@angular/core'
import { NavController, App, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AroundDetailController } from './aroundDetail'
import { Geolocation } from '@ionic-native/geolocation';

import { FirestoreService } from '../../services/firestoreService'
import { Admin, Member } from '../../angularModel'

import { Subscription } from 'rxjs'
import { ContactChatController } from '../message/contactChat';
import { MessageService } from '../../services/messageService';

@Component({
    selector: 'page-aroundList',
    templateUrl: 'aroundList.html',
})
export class AroundListController implements OnDestroy {
    lat: any;
    lng: any;
    aroundDetailPage: any = AroundDetailController

    logged: Boolean = false
    adminsSubscription: Subscription
    chatSubscription: Subscription
    admins = new Array<Admin>()
    admin: Admin = null
    anotherUser: Admin = null
    myAccount: string
    anotherMember: Member

    constructor(private appCtrl: App, private firestoreService: FirestoreService, private messageService: MessageService, angularfireAuth: AngularFireAuth, private toastCtrl: ToastController, public navCtrl: NavController, public geo: Geolocation) {
        angularfireAuth.authState.subscribe(firebaseUser => {
            this.logged = !!firebaseUser
            if (this.logged) {
                this.myAccount = firebaseUser.uid
                firestoreService.getAdminByAccount(firebaseUser.uid).subscribe(admin => {
                    admin.member.position.lat = this.lat
                    admin.member.position.lng = this.lng
                    firestoreService.setFcmToken(admin)
                    this.admin = admin
                })
            }
            else
                this.ngOnDestroy()
        })
    }

    GetDistance( lat1,  lng1,  lat2,  lng2) {
        var radLat1 = lat1*Math.PI / 180.0;
        var radLat2 = lat2*Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378.137 ;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s;
    }

    ionViewDidLoad() {
        console.log("in aroundList ionViewDidLoad")
        this.lookAround()
    }

    lookAround() {
        this.geo.getCurrentPosition().then(pos => {
            this.lat = Math.round(pos.coords.latitude * 10000000) / 10000000;
            this.lng = Math.round(pos.coords.longitude * 10000000) / 10000000;
        }).catch(err => console.log(err));

        this.adminsSubscription = this.firestoreService.getAdmins().subscribe(admins => {
            this.admins = admins.filter(admin => {
                console.log(admin)
                if (this.GetDistance(admin.member.position.lat, admin.member.position.lng, this.admin.member.position.lat, this.admin.member.position.lng) <= 500)
                    return admin.account !== this.myAccount
            })
        })
    }

    ngOnDestroy() {
        if (this.adminsSubscription)
            this.adminsSubscription.unsubscribe()
        if (this.chatSubscription)
            this.chatSubscription.unsubscribe()
        this.admins = []
    }

    addFriend(anotherUser: Member) {
        console.log("account:" + anotherUser.account)
        console.log("myAccount:" + this.admin.account)
        this.firestoreService.addFriend(this.admin.member, anotherUser)
        const toast = this.toastCtrl.create({
            message: '交友成功!',
            duration: 2000
        });
        toast.present();
    }

    contactChat(account: string) {
        this.chatSubscription = this.firestoreService.getAdminByAccount(account).subscribe(admin => this.anotherMember = admin.member)
        this.messageService.addChatMember(this.admin.member, this.anotherMember, false)
        console.log("chat around: " + this.anotherMember)
        this.appCtrl.getRootNav().push(ContactChatController, account)
    }
}
