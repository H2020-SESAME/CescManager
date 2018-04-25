Meteor.subscribe("networkservices");
Meteor.subscribe("slas");

Template.catalogns.helpers({
	
    nsdata: function () {
     
        return NetworkServices.find();
      
    },
	sladata: function() {
		var result;
		
	 
	}



});




Template.catalogns.events({
    'submit #createns': function (e) {
        e.preventDefault();
        var nsname = event.target.nsname.value;
        var nsdescription = event.target.nsdescription.value;
        //alert(links[0]['id']);
        //console.log(nodes);
        //console.log(links);

        if (nsname!="" && nsdescription!=""){
        	
        	a = new Array();
        	for (var i=0;i<nodes.length;i++){
        		//console.log(nodes[i]["text"]);
        		//Meteor.call("addNode", nsname, nodes[i]["text"]);
				a.push({node: nodes[i]["text"]});
        	}

        	
        	b = new Array();
       		for (var i=0;i<links.length;i++){
        		var link = links[i]["id"];
        		//console.log("ARXI: "+link[2]+" - TELOS: "+link[5]);
        		console.log("ARXI: "+nodes[link[2]]["text"]+" - TELOS: "+nodes[link[5]]["text"]);
        		b.push({link: link});

        	}

			operator = $('.form-group-ops input:checked').val();
			//alert(operator);
			sla = $('.hero-select .selected > input').val();
			//alert(sla);
			
			/*Meteor.call('atosCall',operator, sla, nsname, function(error, results) {
				 //results.data should be a JSON object
				//alert(results);
				console.log(results);
				result = results;
			});*/
			console.log("operator "+ operator + " sla " + sla);
        	Meteor.call("addNode", nsname, nsdescription, operator, sla, a, b);
			
			
        	alert("NS Created!");

    	}else{

    		alert("Empty Fields");

    	}

    },
	
	'click #delete': function (e) {
        e.preventDefault();
        //console.log($(e.currentTarget).attr("nsid"));
        var dnsid = $(e.currentTarget).attr("dnsid");
        Session.set("dnsid", $(e.currentTarget).attr("dnsid"));
        var objecto2 = NetworkServices.find({_id: dnsid}).fetch();
        console.log(objecto2);

        
        Meteor.call("removeCatalogueNS", objecto2[0]["_id"]);
        alert("Network Service removed.");
       

    }
});