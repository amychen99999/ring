import { Component, OnDestroy } from '@angular/core'
import { ToastController, AlertController, NavController } from 'ionic-angular'
import { AngularFireAuth } from 'angularfire2/auth'

import { FirestoreService } from '../../services/firestoreService'
import { MessageService } from '../../services/messageService'
import { RegisterController } from './register'

import { ChatMessage, Admin } from '../../angularModel'
import { Subscription } from 'rxjs'

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html',
})
export class SettingController implements OnDestroy {
    registerPage: any = RegisterController
    logged: Boolean = false
    adminSubscription: Subscription
    admin: Admin = null
    errorMessage: string = ""

    constructor(firebaseService: FirestoreService, messageService: MessageService, private angularfireAuth: AngularFireAuth, toastCtrl: ToastController, private alertCtrl: AlertController, public navCtrl: NavController) {
        angularfireAuth.authState.subscribe(firebaseUser => {
            this.logged = !!firebaseUser
            if (this.logged) {
                this.adminSubscription = firebaseService.getAdminByAccount(firebaseUser.uid).subscribe(admin => this.admin = admin)
            } else
                this.ngOnDestroy()
        })
    }

    signIn(account: string, password: string) {
        this.angularfireAuth.auth.signInWithEmailAndPassword(account, password)
            .then(() => this.errorMessage = "")
            .catch(() => {
                this.errorMessage = "密碼不正確，請重新登入"
            })
    }

    async resetPassword() {
        await this.angularfireAuth.auth.sendPasswordResetEmail(this.admin.account)
        this.alertCtrl.create({
            title: "修改密碼",
            message: "重設密碼信件，已發送至信箱，請查看",
            buttons: [{ text: "確認" }]
        }).present()
    }

    signOut() {
        this.angularfireAuth.auth.signOut()
    }

    ngOnDestroy() {
        if (this.adminSubscription)
            this.adminSubscription.unsubscribe()
        this.admin = null
        this.errorMessage = ""
    }

    goToRegisterPage() {
        this.navCtrl.push(this.registerPage)
    }
}
