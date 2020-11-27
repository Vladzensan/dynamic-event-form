({
    handleReturn: function(component, event) {
        var homeEvt = $A.get("e.force:navigateToObjectHome");
        homeEvt.setParams({
            "scope": "Event"
        });
        homeEvt.fire();
    }
})
