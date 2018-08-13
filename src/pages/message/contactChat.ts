import { Component, ViewChild, OnDestroy } from '@angular/core'
import { IonicPage, Content, NavParams } from 'ionic-angular'
import * as uuid from 'uuid'
import { AngularFireAuth } from 'angularfire2/auth'

import { FirestoreService } from '../../services/firestoreService'
import { MessageService } from '../../services/messageService'
import { Admin, ChatMessage, ChatMember } from '../../angularModel'
import { Subscription } from 'rxjs'

@IonicPage()
@Component({
    selector: 'page-contactChat',
    templateUrl: 'contactChat.html',
})
export class ContactChatController implements OnDestroy {

    @ViewChild(Content) content: Content

    myAccount: string
    senderAccount: string
    receiverAccount: string

    chatMessage: string = ""
    chatAdmin: Admin
    chatAdminSubscription: Subscription
    chatMember: ChatMember = null
    chatMemberSubscription: Subscription

    chatMessages: ChatMessage[] = []
    messageSubscription: Subscription

    constructor(navParams: NavParams, firestoreService: FirestoreService, private messageService: MessageService, angularfireAuth: AngularFireAuth) {
        this.receiverAccount = navParams.data as string
        angularfireAuth.authState.subscribe(async firebaseUser => {
            if (firebaseUser) {
                this.myAccount = firebaseUser.uid
                this.getChatMessages()
                this.messageSubscription = messageService.getChatMessageByAccount(this.myAccount).subscribe(async chatMessages => {
                    console.log(chatMessages)
                    for (const chatMessage of chatMessages) {
                        await messageService.insertChatMessageToSQLiteDB(chatMessage)
                        messageService.deleteChatMessage(this.myAccount, chatMessage.id)
                    }
                    this.getChatMessages()
                })
                this.senderAccount = this.myAccount
                this.chatMemberSubscription = messageService.getChatMember(this.senderAccount, this.receiverAccount).subscribe(chatMember => {
                    this.chatMember = chatMember
                    console.log(chatMember)
                })
            }
        })

        console.log(this.receiverAccount)
        this.chatAdminSubscription = firestoreService.getAdminByAccount(this.receiverAccount).subscribe(admin => this.chatAdmin = admin)
        
    }

    async getChatMessages() {
        this.chatMessages = await this.messageService.getChatMessageFromSQLiteDB(this.myAccount, this.receiverAccount)
        this.content.scrollToBottom(500)
    }

    async sendChatMessage() {
        if (this.chatMessage !== "") {
            const chatMessage = {
                sender: this.senderAccount,
                receiver: this.receiverAccount,
                message: this.chatMessage
            }
            this.chatMessages.push(chatMessage)
            this.chatMessage = ""
            this.messageService.publishChatMessage(chatMessage)
        }
    }

    ngOnDestroy() {
        if (this.chatAdminSubscription)
            this.chatAdminSubscription.unsubscribe()
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe()
        this.chatAdmin = null
    }
}
