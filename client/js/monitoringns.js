Meteor.subscribe("networkservices");
Meteor.subscribe("alerts");

Template.monitoringns.helpers({
	/*
    emptyBoats: function () {
    	var numberOfBoats = Boats.find({ userid: Meteor.userId() }).count();
    	if (numberOfBoats == 0){
        	return true;
        }else{
        	return false;
        }
    
    },
    */
    nsdata: function () {
     
        return NetworkServices.find();
      
    },
    dnsdata: function () {
     
        return DeployedNetworkServices.find();
      
    }



});