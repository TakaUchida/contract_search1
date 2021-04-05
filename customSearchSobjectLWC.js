import { LightningElement,track} from 'lwc';
// import server side apex class method 
import getContactList from '@salesforce/apex/customSearchSobjectLWC.getContactList';
// import standard toast event 
//トースト
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
 
export default class customSearchSobjectLWC extends LightningElement {
    //HTMLから参照する属性には @track を付けます。
    //@track または @apiを付けた属性は、内容が更新されると画面が再描画されます。
    @track contactsRecord;
    searchValue = '';
 
    // update searchValue var when input field value change
    //lightning-input  =target
    //onchange  =event
    //value={searchValue}  =value
    //javascript Eventの基礎
    searchKeyword(event) {
        this.searchValue = event.target.value;
    }
 
    // call apex method on button click 
    handleSearchKeyword() {
        
        if (this.searchValue !== '') {
            getContactList({
                    searchKey: this.searchValue
                })
                //getContactListが正常終了した場合
                .then(result => {
                    // set @track contacts variable with return contact list from server  
                    console.log('result: ' + JSON.stringify(result));
                    this.contactsRecord = result;
                })
                //getContactListが正常終了しなかった場合
                .catch(error => {
                   
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);
                    // reset contacts var with null   
                    this.contactsRecord = null;
                });
        } else {
            // fire toast event if input field is blank
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'Search text missing..',
            });
            this.dispatchEvent(event);
        }
    }
}