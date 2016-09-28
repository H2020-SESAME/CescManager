



Meteor.publish("networkservices", function(){ 
    
    return NetworkServices.find();

});

Meteor.publish("deployednetworkservices", function(){ 
    
    return DeployedNetworkServices.find();

});


Meteor.publish("networkservice", function(){ 

    return NetworkServices.find({ userid: this.userId });

});




Meteor.publish("lastposition", function(devid){ 
    
    //return Geodatafinal.find({}, {limit: 1});
    return Geodatafinal.find({deviceid: devid}, {sort: {createdAt: -1}, limit: 1});

});