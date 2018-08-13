import { Component, OnDestroy } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { AngularFireAuth } from 'angularfire2/auth'

import { FirestoreService } from '../../services/firestoreService'
import { Admin } from '../../angularModel'
import { Subscription } from 'rxjs'

@Component({
    selector: 'page-friend-detail',
    templateUrl: 'friendDetail.html',
})
export class FriendDetailController implements OnDestroy {
    logged: Boolean = false
    adminSubscription: Subscription
    admin: Admin = null

    constructor(private navCtrl: NavController, navParams: NavParams, firestoreService: FirestoreService, angularfireAuth: AngularFireAuth) {
        const account = navParams.data as string
        angularfireAuth.authState.subscribe(firebaseUser => {
            this.logged = !!firebaseUser
            if (this.logged)
                this.adminSubscription = firestoreService.getAdminByAccount(account).subscribe(admin => this.admin = admin)
            else {
                this.ngOnDestroy()
                navCtrl.pop()
            }
        })
    }

    ngOnDestroy() {
        if (this.adminSubscription)
            this.adminSubscription.unsubscribe()
        this.admin = null
    }
}
