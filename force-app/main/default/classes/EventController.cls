public with sharing class EventController {

    @AuraEnabled(cacheable = true)
    public static List<FieldInfo> getFields(String eventId) {
        List<FieldInfo> fields = new List<FieldInfo>();

        for(Schema.FieldSetMember fieldSetMember : SObjectType.Event.FieldSets.Event_Fields.getFields()) {
            FieldInfo FieldInfo = new FieldInfo(fieldSetMember);
            fields.add(FieldInfo);
        }

        if(eventId != null  && !String.isEmpty(eventId)) {
            setFieldValues(fields, eventId);
        }

        return fields;
    }

    private static void setFieldValues(List<FieldInfo> fieldInfos, Id eventId) {
        String joinedFieldNames = '';
        for(FieldInfo fieldInfo : fieldInfos) {
            joinedFieldNames += fieldInfo.apiName + ', ';
        }

        Event event = (Event) Database.query('SELECT ' + joinedFieldNames + 'Id FROM Event WHERE Id = :eventId')[0];

        for(FieldInfo fieldInfo : fieldInfos) {
            fieldInfo.value = event.get(fieldInfo.apiName);
        }
    }
    
}
