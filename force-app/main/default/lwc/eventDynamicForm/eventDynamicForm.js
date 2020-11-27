import { LightningElement, api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFieldsInfo from '@salesforce/apex/EventController.getFields';
import saveEvent from '@salesforce/apex/EventController.saveEvent';

const FIELDS_FETCH_ERROR = "Error occurred while fetching fields";
const EVENT_SAVE_SUCCESS = "Event successfully saved";
const EVENT_SAVE_ERROR = "Error occurred while saving event";

export default class EventDynamicForm extends LightningElement {
    @api eventId;
    @track fieldInfos;
    eventRecord = new Map();

    connectedCallback() {
        this.fetchEventFields(this.eventId);
    }

    fetchEventFields(eventId) {
        getFieldsInfo({eventId: eventId})
            .then(data => {
                this.initEventRecord(data);
                var tempFields = JSON.parse(JSON.stringify(data)); // since fields in data var are read-only
                this.setInputTypes(tempFields);
                this.fieldInfos = tempFields;

            })
            .catch(error => {
                this.showToast(FIELDS_FETCH_ERROR,
                                error.message,
                                "error");
      });
    }

    setInputTypes(fields) {
        for(var i = 0; i < fields.length; i++) {
                fields[i].dataType = this.transformTypeToLightning(fields[i].dataType);
          }

    }

    transformTypeToLightning(type) {
        switch(type) {
            case 'INTEGER':  return 'number';
            case 'TEXTAREA': return 'text';
            case 'BOOLEAN':  return 'checkbox';
            case 'DATETIME': return 'datetime';
            case 'DATE':     return 'date';

            default:         return type;
        }
    }

    initEventRecord(fields) {
        for(var i = 0; i < fields.length; i++) {
            this.eventRecord.set(fields[i].apiName, fields[i].value);
        }
    }

    onFieldValueChange(evt) {
        var value = evt.target.value;

        if(evt.target.type === "number") {
            value = +value;
        }

        this.eventRecord.set(evt.target.name, value);
        console.log(JSON.stringify([...this.eventRecord]));
    }

    saveEvent() {
        var toSave = Object.fromEntries(this.eventRecord);
        console.log(JSON.stringify(toSave));
        saveEvent({event : toSave})
            .then((response) => {
        
                this.showToast("Success",
                                    EVENT_SAVE_SUCCESS,
                                    "success")
                })
            .catch(error => {
        
                this.showToast("Error", 
                                    EVENT_SAVE_ERROR,
                                    "error");
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
          new ShowToastEvent({
                    title,
                    message,
                    variant
          })
        );
      }
}