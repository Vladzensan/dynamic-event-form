public with sharing class FieldInfo {

    public class PicklistItem {
        @AuraEnabled
        public String label {get;set;}
      
        @AuraEnabled
        public String value {get;set;}

        public PicklistItem(String label, String value) {
            this.label = label;
            this.value = value;
        }
    }

    @AuraEnabled
    public String label {get;set;}
      
    @AuraEnabled
    public Object value {get;set;}
  
    @AuraEnabled
    public String apiName {get;set;}
  
    @AuraEnabled
    public Boolean required {get;set;}

    @AuraEnabled
    public String dataType {get;set;}

    @AuraEnabled
    public Boolean isPicklist {get;set;}
  
    @AuraEnabled
    public List<PicklistItem> picklistValues {get;set;}
  
    public FieldInfo(FieldSetMember fieldSetMember) {
      this.label = fieldSetMember.getLabel();
      this.apiName = fieldSetMember.getFieldPath();
      this.required = fieldSetMember.getRequired();
      this.dataType = fieldSetMember.getType().name();
  
      if(this.dataType == Schema.DisplayType.Picklist.name()) {
        this.isPicklist = true;
        
        this.picklistValues = new List<PicklistItem>();
        List<Schema.PicklistEntry> picklistEntries = fieldSetMember
                                                        .getSObjectField()
                                                        .getDescribe()
                                                        .getPicklistValues();
        
        for(Schema.PicklistEntry entry : picklistEntries) {
            this.picklistValues.add(
                new PicklistItem(entry.getLabel(), entry.getValue())
            );
        }
      }
    }
}
