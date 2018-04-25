Meteor.subscribe("networkservices");
Meteor.subscribe("alerts");
Meteor.subscribe("violations");
//Meteor.subscribe("recentViolations");

		



Template.monitoringns.created = function() {
  var self = this;
  var now = 0;
  self.timeNow = new ReactiveVar(now);

  self.autorun(function() {
    Meteor.setInterval(function() {
      self.timeNow.set(new Date().getTime()); // Forces reactivity with the helper
    }, 30000);
  });
}

Template.monitoringns.helpers({
	
	violdata(){
		Template.instance().timeNow.get();
		var now = Date.now() - 3 * 60 * 1000;
        return Violations.find({"createdAt" : { $gte : now }});
	},
	
	violsNS(){
		return NetworkServices.findOne({slaname: this.contractUuid});
	}


});

