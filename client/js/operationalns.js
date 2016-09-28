Meteor.subscribe("networkservices");
Meteor.subscribe("deployednetworkservices");



Template.operationalns.helpers({
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



Template.donensop.helpers({

        state: function () {
            var returnstring = "";
            
            if (this.started==0){
                returnstring = "Stopped";
            }else if (this.started==1){
                returnstring = "Started";
            }else if (this.started==2){
				returnstring = "Loading";
			}
            //console.log(returnstring);
            return returnstring;
        },
        startstop: function () {
            var returnstring = "";

        
            if (this.started==0){
                returnstring = "START";
            }else if (this.started==1){
                returnstring = "STOP";
            }else if (this.started==2){
				returnstring = "---";
			}
			
            //console.log(returnstring);
            return returnstring;
        },
        nsconfig: function () {
            var returnstring = "";



             var help = this.nsconf.split(":");

            returnstring = "Source: "+help[1]+"<br>Destination: "+help[0];


        
            //console.log(returnstring);
            return returnstring;
        }

});


Template.donensop.events({
    'click #start': function (e) {
        e.preventDefault();
        //console.log($(e.currentTarget).attr("nsid"));
        var dnsid = $(e.currentTarget).attr("dnsid");
        Session.set("dnsid", $(e.currentTarget).attr("dnsid"));
        var objecto2 = DeployedNetworkServices.find({_id: dnsid}).fetch();
        console.log(objecto2);

        var help = objecto2[0]["nsconf"].split(":");
        var source = help[1];
        var destination = help[0];


        console.log("Deployment start");
        if (objecto2[0]["started"]==0){
            Meteor.call("deployedState", objecto2[0]["_id"], 1);


            var str2 = "ovs-ofctl add-flow archidamus priority=77,dl_type=0x800,in_port=8,nw_src="+source+",nw_dst="+destination+",actions=mod_dl_dst=fa:16:3e:71:b2:a1,output:4/ovs-ofctl add-flow archidamus priority=77,dl_type=0x0800,nw_src="+source+",nw_dst="+destination+",in_port=4,actions=mod_dl_dst:00:90:f5:53:80:6d,output:6";
            Meteor.call("sendUDP", "start", 1)


            //alert("Deployed NS started");

        }else if (objecto2[0]["started"]==1){
            Meteor.call("deployedState", objecto2[0]["_id"], 0);

            var str2 = "ovs-ofctl --strict del-flows archidamus priority=77,dl_type=0x800,in_port=8,nw_src="+source+",nw_dst="+destination+"/ovs-ofctl --strict del-flows archidamus priority=77,dl_type=0x0800,nw_src="+source+",nw_dst="+destination+",in_port=4";
            Meteor.call("sendUDP", "stop", 1)

            //alert("Deployed NS stopped");

        }



    },
    'click #delete': function (e) {
        e.preventDefault();
        //console.log($(e.currentTarget).attr("nsid"));
        var dnsid = $(e.currentTarget).attr("dnsid");
        Session.set("dnsid", $(e.currentTarget).attr("dnsid"));
        var objecto2 = DeployedNetworkServices.find({_id: dnsid}).fetch();
        console.log(objecto2);

        Meteor.call("deployedState", objecto2[0]["_id"], 0);

        var help = objecto2[0]["nsconf"].split(":");
        var source = help[1];
        var destination = help[0];

        var wtf2 = "ovs-ofctl --strict del-flows archidamus priority=77,dl_type=0x800,in_port=8,nw_src="+source+",nw_dst="+destination+"/ovs-ofctl --strict del-flows archidamus priority=77,dl_type=0x0800,nw_src="+source+",nw_dst="+destination+",in_port=4";
        Meteor.call("sendUDP", wtf2, 3)


        myId = dnsid;
        console.log("TO ID EINAI::::::"+myId);
        console.log("delete:"+source+":"+destination+":"+dnsid+"-0:"+dnsid+"-1:"+dnsid+"-2");

                

        var wtf5 = "delete:"+source+":"+destination+":"+dnsid+"-0:"+dnsid+"-1:"+dnsid+"-2";
        Meteor.call("tenorCallDel", myId);
		Meteor.call("sendUDP", wtf5, 1);

        Meteor.call("removeDeployed", objecto2[0]["_id"]);
        alert("Deployed Network Service removed.");
       

    }

    
});









Template.onensop.helpers({

        dokimi: function () {
     
         return "yoyo";
      
        },
        gmts: function () {
            var returnstring = "";

            returnstring = returnstring + "Nodes: "
            for (var i=0;i<this.nodes.length;i++){
                returnstring = returnstring + this.nodes[i]['node'] + "("+i+"), ";
                //console.log("RE-> "+i);
            }
            returnstring = returnstring.substring(0, returnstring.length - 2);
            returnstring = returnstring + "  |   Links: ";
            
            for (var i=0;i<this.links.length;i++){
                var mylink = this.links[i]['link'];
                var helperstring = this.nodes[mylink[2]]['node'] + "("+mylink[2]+")"+" ->" + this.nodes[mylink[5]]['node']+"("+mylink[5]+")";
                returnstring = returnstring + helperstring + ", ";
            }
            returnstring = returnstring.substring(0, returnstring.length - 2);
            
            //console.log(returnstring);
            return returnstring;
        }

});



Template.onensop.events({
    'click #deploy': function (e) {
        e.preventDefault();
        //console.log($(e.currentTarget).attr("nsid"));
        var nsid = $(e.currentTarget).attr("nsid");
        Session.set("nsid", $(e.currentTarget).attr("nsid"));
        var objecto2 = NetworkServices.find({_id: nsid}).fetch();
        console.log(objecto2);
        if (objecto2[0]){
            console.log(objecto2[0]["nsname"]);
            console.log("Nodes length: " + objecto2[0]["nodes"].length);
            console.log("Links length: " + objecto2[0]["links"].length);
            console.log("Steps: "+ objecto2[0]["nodes"].length);
            console.log(objecto2[0]["nodes"]);
            Session.set("currentstepname", objecto2[0]["nodes"][0]["node"]);
            Session.set("currentstep", 0);
            Session.set("totalsteps", objecto2[0]["nodes"].length);
            Session.set("returner","");
            Session.set("nsconf","");
            $('#myModal'+nsid).modal('show');
        }



    }
    
});


Template.modaltemplate.helpers({

        currentstepname: function () {
     
         return Session.get("currentstepname") + "("+Session.get("currentstep")+")";
      
        },
        currentstep: function () {
     
         return Session.get("currentstep")+1;
      
        },
        totalsteps: function () {
     
         return Session.get("totalsteps");
      
        },
        buttontext: function () {
            if ((Session.get("currentstep")+1) != Session.get("totalsteps")){
                return "Next";
            }else{
                return "Deploy";
            }
      
        },
        options: function () {
                
            var whatreturn = "";


            console.log("eee moglizz-> "+Session.get("currentstepname"));
            if (Session.get("currentstepname") == "Endpoint"){
                
                whatreturn= "<div class=\"form-group\"><label for=\"exampleInputEmail1\">IP</label><input type=\"text\" class=\"form-control\" id=\"endip\" placeholder=\"192.168.1.50\"></div><div class=\"form-group\"><label for=\"exampleInputEmail1\">Protocol</label><input type=\"text\" class=\"form-control\" id=\"exampleInputEmail1\" placeholder=\"UDP\"></div><div class=\"form-group\"><label for=\"exampleInputEmail1\">Port</label><input type=\"text\" class=\"form-control\" id=\"exampleInputEmail1\" placeholder=\"5001\"></div>";
            }else if (Session.get("currentstepname") == "vSG" || Session.get("currentstepname") == "vSEM" || Session.get("currentstepname") == "vST"){
                whatreturn= "<div class=\"form-group\"><label>NFVI PoP</label><select id=\"pop\" class=\"form-control\"><option value=\"1\">nfvipop1</option><option value=\"2\">nfvipop2</option></select></div>";
            }else if (Session.get("currentstepname") == "vMT"){
                whatreturn= "<div class=\"form-group\"><label>NFVI PoP</label><select id=\"pop\" class=\"form-control\"><option value=\"1\">nfvipop1</option><option value=\"2\">nfvipop2</option></select></div><div class=\"form-group\"><label for=\"exampleInputEmail1\">Bitrate (bps)</label><input type=\"text\" class=\"form-control\" id=\"exampleInputEmail1\" placeholder=\"512\"></div><div class=\"form-group\"><label for=\"exampleInputEmail1\">Resolution</label><input type=\"text\" class=\"form-control\" id=\"exampleInputEmail1\" placeholder=\"800x600\"></div>";
            }else if (Session.get("currentstepname") == "vFW"){
                whatreturn= "<div class=\"form-group\"><label>NFVI PoP</label><select id=\"pop\" class=\"form-control\"><option value=\"1\">nfvipop1</option><option value=\"2\">nfvipop2</option></select></div>";
            }


            return whatreturn;
      
        },
        gmts: function () {
            var returnstring = "";

            returnstring = returnstring + "Nodes: "
            for (var i=0;i<this.nodes.length;i++){
                returnstring = returnstring + this.nodes[i]['node'] + "("+i+"), ";
                //console.log("RE-> "+i);
            }
            returnstring = returnstring.substring(0, returnstring.length - 2);
            returnstring = returnstring + "  |   Links: ";
            
            for (var i=0;i<this.links.length;i++){
                var mylink = this.links[i]['link'];
                var helperstring = this.nodes[mylink[2]]['node'] + "("+mylink[2]+")"+" ->" + this.nodes[mylink[5]]['node']+"("+mylink[5]+")";
                returnstring = returnstring + helperstring + ", ";
            }
            returnstring = returnstring.substring(0, returnstring.length - 2);
            
            //console.log(returnstring);
            return returnstring;
        }

});


Template.modaltemplate.events({
    'submit #vnfform': function (e) {
        e.preventDefault();


        if (Session.get("currentstepname") != "Endpoint"){
            var pop = e.target.pop.value;
            Session.set("returner",Session.get("returner")+pop+"."+Session.get("currentstepname")+":");
        }else if (Session.get("currentstepname") == "Endpoint"){
            var endip = e.target.endip.value;
            console.log(endip);
            Session.set("nsconf", endip+":"+Session.get("nsconf"));
            //console.log("NSCONF:");
            //console.log(Session.get("nsconf"));
        }
        console.log("selected is->"+pop);
/*
    },
    'click #nextbutton': function (e) {
        e.preventDefault();
*/


        //console.log($(e.currentTarget).attr("nsid"));
        

        /*
        var nsid = $(e.currentTarget).attr("nsid");

        var objecto2 = NetworkServices.find({_id: nsid}).fetch();
        console.log(objecto2);
        if (objecto2[0]){
            console.log(objecto2[0]["nsname"]);
            console.log("Nodes length: " + objecto2[0]["nodes"].length)
            console.log("Links length: " + objecto2[0]["links"].length)
            console.log("Steps: ");
            $('#myModal'+nsid).modal('show');
        }
        */

        if ((Session.get("currentstep")+1) != Session.get("totalsteps")){
            var nsid2 = Session.get("nsid");
            var objecto2 = NetworkServices.find({_id: nsid2}).fetch();
            console.log(objecto2);

           
            if (objecto2[0]){
                Session.set("currentstep", Session.get("currentstep")+1);
                Session.set("currentstepname", objecto2[0]["nodes"][Session.get("currentstep")]["node"]);
            }
        }else{


            
          
            

            var nsid2 = Session.get("nsid");
            var objecto2 = NetworkServices.find({_id: nsid2}).fetch();
            console.log(objecto2);
       
            
            if (objecto2[0]){
            

                for (var i=0;i<objecto2[0]["nodes"].length;i++){
                    if (objecto2[0]["nodes"][i]["node"] != "Endpoint"){
                        wtf = wtf + ":" + objecto2[0]["nodes"][i]["node"];
                    }
                }
            
            }

           

            Session.set("returner",Session.get("returner").substring(0, Session.get("returner").length - 1));
            console.log(Session.get("returner"));

            var res = Session.get("returner").split(":");


            console.log("----------------");
            console.log(res);


            var packets = [];

            for (var i=0;i<res.length;i++){
                var helpinghand = res[i].split(".");
                if (packets[helpinghand[0]] == null){
                    packets[helpinghand[0]] = "";
                }
                packets[helpinghand[0]] = packets[helpinghand[0]] + helpinghand[1] + ":";
            }

            var nsconfhelper = Session.get("nsconf").substring(0, Session.get("nsconf").length - 1);


            for (var i=1;i<packets.length;i++){
                packets[i] = packets[i].substring(0, packets[i].length - 1);
                //console.log(packets[i]);
                var wtf = "spawn:"+nsconfhelper+":"+packets[i];
                //Meteor.call("sendUDP", wtf, i);
                console.log("first stand");
                console.log(wtf+"@POP"+i);
            }
            
            //var wtf2 = "ovs-vsctl show/ovs-vsctl add-flow br-int/einai ola kala:)";
            //Meteor.call("sendUDP", wtf2, 3);
            //Meteor.call("sendUDP", wtf);

            console.log("epitelous :)");

            
            var theId;
            Meteor.call("addDeployed", objecto2[0]["_id"], objecto2[0]["nsname"], nsconfhelper, function(error,result){
                theId = result;
                console.log("TO ID EINAI::::::"+result);

                var packets2 = [];

                for (var i=0;i<res.length;i++){
                    var helpinghand = res[i].split(".");
                    if (packets2[helpinghand[0]] == null){
                        packets2[helpinghand[0]] = "";
                    }
                    packets2[helpinghand[0]] = packets2[helpinghand[0]] + helpinghand[1] + ":"+theId+"-"+i+":";
                }

                for (var i=1;i<packets2.length;i++){
                    packets2[i] = packets2[i].substring(0, packets2[i].length - 1);
                    //console.log(packets[i]);
                    var wtf = "spawn:"+nsconfhelper+":"+packets2[i];
                    Meteor.call("tenorCallAdd", theId);
					Meteor.call("sendUDP", wtf, i);
                    console.log("last stand");
                    console.log(wtf+"@POP"+i);
                }


                $('#myModal'+Session.get("nsid")).modal('hide');
                $('#myModalSuccess').modal('show');



            });

            
            
        }
        



    }
});






Template.operationalns.events({
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