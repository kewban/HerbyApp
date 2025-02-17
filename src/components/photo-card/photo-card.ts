import {Component, Input} from "@angular/core";
import {ModalController, NavController, PopoverController} from "ionic-angular";
import {GalleryProvider} from "../../providers/gallery";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {UserProvider} from "../../providers/user";
import {ProfilePage} from "../../pages/profile/profile";
import {PhotoCommentModalComponent} from "../photo-comment-modal/photo-comment-modal";
import {PhotoListPopoverComponent} from "../photo-list-popover/photo-list-popover";
import {ChatSharePhotoPage} from "../../pages/chat-share-photo/chat-share-photo";

declare const Parse: any;

@Component({
    selector   : 'photo-card',
    templateUrl: 'photo-card.html'
})
export class PhotoCardComponent {

    @Input() item: any;

    username: any;
    loadingLike: boolean = false;
    _width: any;

    constructor(private provider: GalleryProvider,
                private navCtrl: NavController,
                private modalCtrl: ModalController,
                private popoverCtrl: PopoverController,
                private util: IonicUtilProvider,
                private User: UserProvider
    ) {
        this.username = Parse.User.current()['username'];
        this._width   = util._widthPlatform + 'px';
    }

    openPopover(ev):void {
        this.popoverCtrl.create(PhotoListPopoverComponent, {item: this.item}).present({ev: ev});
    }

    sharePhoto(item):void {
        this.modalCtrl.create(ChatSharePhotoPage, {image: item.obj}).present();
    }

    openComments(item):void {
        console.log(item);
        this.modalCtrl.create(PhotoCommentModalComponent, item).present();
    }

    profile(username: string):void {
        console.log('username', username);
        this.navCtrl.push(ProfilePage, {username: username})
    }

    onLike(item):void {
        console.log(item);
        this.loadingLike = true;
        this.provider.likeGallery(item.id).then(data => {
            if (item.isLiked) {
                item.isLiked = false;
                item.likesTotal--;
            } else {
                item.isLiked = true;
                item.likesTotal++;
            }
            console.log(data);
            this.loadingLike = false;
        });
    }

}
