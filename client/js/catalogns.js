Meteor.subscribe("networkservices");


Template.catalogns.helpers({
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


        	Meteor.call("addNode", nsname, nsdescription, a, b);

        	alert("NS Created!");

    	}else{

    		alert("Empty Fields");

    	}

    }
});