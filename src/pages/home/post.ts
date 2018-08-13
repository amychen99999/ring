import { Component, OnDestroy } from '@angular/core'
import { NavController, NavParams, App, AlertController } from 'ionic-angular'
import { AngularFireAuth } from 'angularfire2/auth'

import { FirestoreService } from '../../services/firestoreService'
import { PostType, Admin, ChatMessage } from '../../angularModel'
import { TabsController} from '../tabs/tabs'
import { Subscription } from 'rxjs'
import { ContactChatController } from '../message/contactChat';
import { MessageService } from '../../services/messageService'

@Component({
    selector: 'page-post',
    templateUrl: 'post.html',
})
export class PostController implements OnDestroy {
    logged: Boolean = false
    postTypeSubscription: Subscription
    postType: PostType = null
    adminSubscription: Subscription
    admin: Admin = null

    adminsSubscription: Subscription
    admins: Admin[] = []
    postMessage: string = ""

    postsSubscription: Subscription
    recieveMessages: ChatMessage[]
    postTypeName: string

    constructor(private appCtrl: App,navCtrl: NavController, navParams: NavParams, firestoreService: FirestoreService, private messageService: MessageService, angularfireAuth: AngularFireAuth, private alertCtrl: AlertController) {
        this.postTypeName = navParams.data as string
        console.log(this.postTypeName)
        this.postsSubscription = messageService.getPosts(this.postTypeName).subscribe(postMessages => this.recieveMessages = postMessages)
        this.postTypeSubscription = firestoreService.getPostTypeByPostName(this.postTypeName).subscribe(postType => this.postType = postType)
        angularfireAuth.authState.subscribe(firebaseUser => {
            this.logged = !!firebaseUser
            if (this.logged) {
                console.log("start")
                this.adminSubscription = firestoreService.getAdminByAccount(firebaseUser.uid).subscribe(admin => this.admin = admin)
                this.adminsSubscription = firestoreService.getAdmins().subscribe(admins => {
                    this.admins = admins.filter(admin => {
                        return admin.account !== firebaseUser.uid && admin.member.fcmToken
                    })
                })
            }
                else {
                this.ngOnDestroy()
                navCtrl.pop()
            }
        })
    }

    ngOnDestroy() {
        if (this.postTypeSubscription)
            this.postTypeSubscription.unsubscribe()
        this.postTypeSubscription = null
        if (this.adminSubscription)
            this.adminSubscription.unsubscribe()
        this.admin = null
        if (this.adminsSubscription)
            this.adminsSubscription.unsubscribe()
        this.admins = null
        if (this.postsSubscription)
            this.postsSubscription.unsubscribe()
        this.postMessage = null
    }

    contactChat(account: string) {
        this.appCtrl.getRootNav().push(ContactChatController, account)
    }

    log(val) { console.log(val); }

    async sendPostMessage() {
        if (this.postMessage !== "") {
            const postMessage = {
                postType: this.postType.typeName,
                sender: this.admin.account,
                position: this.admin.member.position,
                message: this.postMessage
            }
            this.messageService.publishPostMessage(postMessage)
            this.postMessage = ""
            this.alertCtrl.create({
                title: this.postType.title,
                message: "公告已發送",
                buttons: [{ text: "確認" }]
            }).present()
        }
    }
}
