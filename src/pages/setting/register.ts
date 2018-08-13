import { Component, OnDestroy } from '@angular/core'
import { ToastController, AlertController, NavController } from 'ionic-angular'
import { AngularFireAuth } from 'angularfire2/auth'

import { FirestoreService } from '../../services/firestoreService'
import { MessageService } from '../../services/messageService'

import { ChatMessage, Admin } from '../../angularModel'
import { Subscription } from 'rxjs'
import { SettingController } from './setting';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterController implements OnDestroy {
    signInPage: any = SettingController
    logged: Boolean = false
    adminSubscription: Subscription
    admin: Admin = null
    admins: Admin[]
    errorMessage: string = ""
    registerInf = {name: '', account: '', email: '', phone: ''}
    accountExist: boolean = false

    constructor(private firebaseService: FirestoreService, messageService: MessageService, private angularfireAuth: AngularFireAuth, private toastCtrl: ToastController, private alertCtrl: AlertController, public navCtrl: NavController) {
        this.firebaseService.getAdmins().subscribe(admins => this.admins = admins)
    }

    register(){
        this.adminSubscription = this.firebaseService.getAdminByAccount(this.registerInf.account).subscribe(admin => {
            var id = (this.admins.length + 2).toString()
            if (admin) {
                this.accountExist = true
                this.errorMessage = "帳號重複"
                this.registerInf = {name: '', account: '', email: '', phone: ''}
            } else {
                this.admin = {
                    id: id,
                    account: this.registerInf.account,
                    member: {
                        id: id,
                        account: this.registerInf.account,
                        name: this.registerInf.name,
                        phone: this.registerInf.phone,
                        email: this.registerInf.email,
                        fcmToken: this.registerInf.account,
                        position: {lat: 0, lng: 0}
                    },
                    chatCount: {
                        postCount: 0,
                        sendCount: 0,
                        receiveCount: 0
                    },
                    role: "user"
                }
                this.firebaseService.registerAdmin(this.admin)
                const toast = this.toastCtrl.create({
                    message: '申請成功!',
                    duration: 3000
                  });
                  toast.present();
                console.log(this.admin)
                this.goToSignInPage()
            }
        })
    }

    ionViewDidLoad() {
        console.log("in register ionViewDidLoad")
    }
    // signIn(account: string, password: string) {
    //     this.angularfireAuth.auth.signInWithEmailAndPassword(account, password)
    //         .then(() => this.errorMessage = "")
    //         .catch(() => {
    //             this.errorMessage = "密碼不正確，請重新登入"
    //         })
    // }

    // async resetPassword() {
    //     await this.angularfireAuth.auth.sendPasswordResetEmail(this.admin.account)
    //     this.alertCtrl.create({
    //         title: "修改密碼",
    //         message: "重設密碼信件，已發送至信箱，請查看",
    //         buttons: [{ text: "確認" }]
    //     }).present()
    // }

    // signOut() {
    //     this.angularfireAuth.auth.signOut()
    // }

    ngOnDestroy() {
        if (this.adminSubscription)
            this.adminSubscription.unsubscribe()
        this.admin = null
        this.errorMessage = ""
    }

    goToSignInPage() {
        this.navCtrl.pop()
    }
}
