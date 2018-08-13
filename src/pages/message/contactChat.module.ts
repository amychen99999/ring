import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactChatController } from './contactChat';

@NgModule({
    declarations: [
        ContactChatController,
    ],
    imports: [
        IonicPageModule.forChild(ContactChatController),
    ],
})
export class ContacthatModule { }