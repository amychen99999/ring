import { Component, OnDestroy } from '@angular/core'
import { NavController, NavParams, AlertController } from 'ionic-angular'
import { Subscription } from 'rxjs'
import { AngularFireAuth } from 'angularfire2/auth'

import { FirestoreService } from '../../services/firestoreService'
import { Member, Admin } from '../../angularModel'

@Component({
    selector: 'page-around-detail',
    templateUrl: 'aroundDetail.html',
})
export class AroundDetailController implements OnDestroy {
    logged: Boolean = false

    adminSubscription: Subscription
    admin: Admin = null

    mode: string = "view"

    constructor(navCtrl: NavController, navParams: NavParams, private alertCtrl: AlertController, private firestoreService: FirestoreService, angularfireAuth: AngularFireAuth) {
        const account = navParams.data as string
        angularfireAuth.authState.subscribe(firebaseUser => {
            this.logged = !!firebaseUser
            if (this.logged) {
                // this.adminSubscription = firestoreService.getAdminByAccount(firebaseUser.uid).subscribe(admin => this.admin = admin)
                this.adminSubscription = firestoreService.getAdminByAccount(account).subscribe(admin => this.admin = admin)
            } else {
                this.ngOnDestroy()
                navCtrl.pop()
            }
        })
    }

    // setGrade(student: Student, grade: string) {
    //     this.alertCtrl.create({
    //         title: "評量",
    //         message: "確認送出成績？",
    //         buttons: [
    //             {
    //                 text: "送出",
    //                 handler: () => {
    //                     student.performance.grade = parseInt(grade)
    //                     this.firestoreService.setGrade(student)
    //                     this.toggleMode("view")
    //                 }
    //             },
    //             {
    //                 text: "取消",
    //                 role: "cancel",
    //                 handler: () => {
    //                     this.toggleMode("view")
    //                 }
    //             }
    //         ]
    //     }).present()
    // }

    // toggleMode(mode: string) {
    //     this.mode = mode
    // }

    // isValid(value: string): Boolean {
    //     const regx = /^[0-9]*$/
    //     return regx.test(value)
    // }

    ngOnDestroy() {
        if (this.adminSubscription)
            this.adminSubscription.unsubscribe()
        this.admin = null
    }
}
