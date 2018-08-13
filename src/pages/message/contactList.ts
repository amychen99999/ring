import { Component, OnDestroy } from '@angular/core'
import { AlertController } from 'ionic-angular'
import { App } from 'ionic-angular'
import { AngularFireAuth } from 'angularfire2/auth'
import * as uuid from 'uuid'

import { ContactChatController } from './contactChat'
import { FirestoreService } from '../../services/firestoreService'
import { MessageService } from '../../services/messageService'

import { Admin, ChatMessage, Member, ChatMember } from '../../angularModel'
import { Subscription } from 'rxjs'

@Component({
    selector: 'page-contactList',
    templateUrl: 'contactList.html',
})
export class ContactListController implements OnDestroy {
    logged: Boolean = false

    chatSubscription: Subscription
    myAccount: string
    chatMembers?: ChatMember[] = []
    friends: Member[]

    constructor(private appCtrl: App, private firebaseService: FirestoreService, private messageService: MessageService, angularfireAuth: AngularFireAuth, private alertCtrl: AlertController) {
        this.friends = []
        angularfireAuth.authState.subscribe(firebaseUser => {
            this.logged = !!firebaseUser
            if (this.logged) {
                this.myAccount = firebaseUser.uid
                this.chatSubscription = messageService.getChatMembers(this.myAccount).subscribe(chatMembers => this.chatMembers = chatMembers)
            } else
                this.ngOnDestroy()
        })
    }

    contactChat(account: string) {
        this.appCtrl.getRootNav().push(ContactChatController, account)
        
    }

    ngOnDestroy() {
        if (this.chatSubscription)
            this.chatSubscription.unsubscribe()
    }
}
