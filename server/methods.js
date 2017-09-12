var dgram = Npm.require('dgram');




Meteor.methods({
  addUser: function (firstName, lastName, email) {
    Userdata.insert({
      firstName: firstName,
      lastName: lastName,
      createdAt: new Date(),
      userid: Meteor.userId(),
      email: email
    });
  },
  addNode: function (nsname, description, nodes, links) {
    NetworkServices.insert({
      nsname: nsname,
      description: description,
      nodes: nodes,
      links: links,
      createdAt: new Date()
    });
  },
  addDeployed: function (nsid, nsname, nsconf, tenornsid, vnfid) {
    return DeployedNetworkServices.insert({
      nsid: nsid,
      nsname: nsname,
      nsconf: nsconf,
	  tenornsid: tenornsid,
	  vnfid: vnfid,
      started: 2,
      createdAt: new Date()
    });
  },
  updateDeployedTenorid: function(nsid, tenornsid){
	  return DeployedNetworkServices.update({_id : nsid},{$set:{tenornsid : tenornsid}});
  },
  updateDeployedVNFid: function(nsid, vnfid){
	  return DeployedNetworkServices.update({_id : nsid},{$set:{vnfid : vnfid}});
  },
  addSLA: function (slaid, slaname) {
    return SLAs.insert({
      slaid: slaid,
      slaname: slaname,
      started: 2,
      createdAt: new Date()
    });
  },
  deployedState: function (dnsid, state) {
      DeployedNetworkServices.update({ _id: dnsid }, { $set: {started: state} });
  },
  getTenoridDNS: function (dnsid){
	  return DeployedNetworkServices.findOne({ _id: dnsid}).tenornsid;
	  
  },
  removeDeployed: function (dnsid) {
      DeployedNetworkServices.remove(dnsid);
  },
  removeCatalogueNS: function (dnsid) {
	  NetworkServices.remove(dnsid);
  },
  
  
  atosCall: function(operator, sla, nsname){
	 output = HTTP.call("POST", "http://10.100.96.10:8080/api/agreements", {
		 headers: {
        'Content-Type': 'application/xml'
    },
	content: 
			'<wsag:Agreement xmlns:sla="http://sla.atos.eu" xmlns:wsag="http://www.ggf.org/namespaces/ws-agreement" wsag:AgreementId="agreement-sesame-'+nsname+operator+'">' +
				'<wsag:Name>'+nsname+operator+'</wsag:Name>'+
				'<wsag:Context>'+
					'<wsag:AgreementInitiator>client-prueba</wsag:AgreementInitiator>'+
					'<wsag:AgreementResponder>provider-a</wsag:AgreementResponder>'+
					'<wsag:ServiceProvider>AgreementResponder</wsag:ServiceProvider>'+
					'<wsag:ExpirationTime>2017-04-07T14:00:00+02:00</wsag:ExpirationTime>'+
					'<wsag:TemplateId>template-a</wsag:TemplateId>'+
					'<sla:Service>'+nsname+'</sla:Service>'+
				'</wsag:Context>'+
				'<wsag:Terms>'+
					'<wsag:All>'+
						'<wsag:ServiceProperties wsag:Name="ServiceProperties" wsag:ServiceName="demo-service">'+
							'<wsag:VariableSet>'+
								'<wsag:Variable wsag:Name="Availability" wsag:Metric="xs:double">'+
									'<wsag:Location>service-prueba/Availability</wsag:Location>'+
								'</wsag:Variable>'+
							'</wsag:VariableSet>'+
						'</wsag:ServiceProperties>'+
						'<wsag:GuaranteeTerm wsag:Name="GT_ResponseTime">'+
							'<wsag:ServiceScope wsag:ServiceName="'+nsname+'">'+
				  '</wsag:ServiceScope>'+
							'<wsag:ServiceLevelObjective>'+
								'<wsag:KPITarget>'+
									'<wsag:KPIName>Availability</wsag:KPIName>'+
									'<wsag:CustomServiceLevel>'+
										'<sla:Slo>'+
											'<sla:Constraint>Availability GT 0.97</sla:Constraint>'+
											'<sla:Description>'+
						  '</sla:Description>'+
										'</sla:Slo>'+
									'</wsag:CustomServiceLevel>'+
								'</wsag:KPITarget>'+
							'</wsag:ServiceLevelObjective>'+
						'</wsag:GuaranteeTerm>'+
					'</wsag:All>'+
				'</wsag:Terms>'+
			'</wsag:Agreement>'
	 }, function (err, result) {
		if (err) {
			console.log('error occurred..');
			console.log(err);
			return;
		}
		console.log(result);
		console.log('----------------------');
	});
  },
  
  

  
  tenorCallRun: function (dnsid) {
		  var updateData = {
	   data: {
		  "ns_id": "1967",
		  "callbackUrl": "https://httpbin.org/post",
		  "flavour": "m1.medium"
	   },
	   headers: {
        'Content-Type': 'application/json'
      }
	}
	
	HTTP.post( 'http://localhost:4000/vnf-provisioning/vnf-instances/'+vnfid+'/', updateData, 
	   function( error, response ) {
		
	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }
		
	});
  },
  
  tenorCallAdd: function (dnsid) {
		
		var nsid;
		
		var updateData = {
	   data: {
		  "vnfds":["1972"],
		  "ns_id": "3880c13a-4b3d-4537-8dc4-2aea00e2d32e",
		  "callbackUrl": "https://httpbin.org/post",
		  "flavour":"Basic",
		  "prometheus_url":"http://10.100.96.10:5000",
		  "pop_id":1,
		  "select_pop_vnfs":"0"
	   },
	   headers: {
        'Content-Type': 'application/json'
      }
	}
	
	HTTP.post( 'http://localhost:4000/ns-instances', updateData, 
	   function( error, response ) {
		
	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
		  var jsonresp = JSON.parse(response.content);
		  nsid = jsonresp.id;
		  console.log("NS ID "+nsid );
		  Meteor.call("updateDeployedTenorid", dnsid, nsid);
	   }
		
	});
	
	var vnfid;
	
	
	var tries = 0;
	var reqstatus;
	Meteor._sleepForMs(30000);
	//while(vnfid == undefined && tries < 100 && reqstatus!='404')
	//{
		Meteor._sleepForMs(2000);
		HTTP.get('http://localhost:4000/ns-instances/'+nsid,
		function( error, response ) {
		
	   if ( error ) {
		  console.log( error );
		  reqstatus = 404;
	   } else {
		  console.log( response );
		  var reqstatus = response.statusCode;
		  var jsonresp = JSON.parse(response.content);
		  vnfid = jsonresp.vnfrs[0].vnfr_id;
		  console.log("VNF ID "+vnfid );
		  Meteor.call("updateDeployedVNFid", dnsid, vnfid);
	   }
		
	});
	//}
	
	
	
  },
  
  
  /*
  results = HTTP.call("GET", "http://10.100.96.10:8080/api/templates");
	  var list;
	  xml2js.parseString(results.content, function (jsError, jsResult) {
                    console.error('errors',jsError);
					var jsstr = JSON.stringify(jsResult);
					var jsonparse = JSON.parse(jsstr);
					
					var i = 0;
					var countslas = jsonparse['templates']['wsag:Template'][i];
					while (countslas != 'undefined'){
						
						console.log('iteration check ',countslas);
						//var servicename = jsonparse['templates']['wsag:Template'][i]['wsag:Terms'][0]['wsag:All'][0]['wsag:ServiceProperties'][0]['$']['wsag:ServiceName'];
                    console.log('xml to js \n',servicename);
					list = servicename;//JSON.parse(jsstr);
					
					Meteor.call('addSLA', '1', list, function(error, results) {
						console.log(results);
					});
					i++;
					}
					
					
                });
	  console.log(list);
	  return list;
	  */
  
  
  
  tenorCallDel: function (dnsid) {
	
	var tenornsid = Meteor.call("getTenoridDNS", dnsid);
	console.log("Tenor NS ID : "+tenornsid);
	var deleteData = {
	   data: {}
	}

	
	HTTP.del( 'http://localhost:4000/ns-instances/'+tenornsid, deleteData, 
	   function( error, response ) {
		
	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }
		
	});
  },
  
  NSStart: function (dnsid, vnfid, operatorid, type) {
	  var updateData = {
	   data: {
		  "body": "sudo /home/ubuntu/vdpi.sh"
	   },
	   headers: {
        'Content-Type': 'application/octet-stream'
      }
	}
	
	HTTP.post( 'http://10.100.96.10:4000/vnf-provisioning/vnf-instances/'+vnfid+'/execute', updateData, 
	   function( error, response ) {
		
	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
		  var jsonresp = JSON.parse(response.content);
		  nsid = jsonresp.id;
		  console.log("NS ID "+nsid );
	   }
		
	});
  },
  
  sendUDP: function (string, where) {
    
            var PORT = 33333;

            console.log(where);

            if (where==1){
              var HOST = '10.143.0.209';
            }else if (where==2){
              var HOST = '10.100.16.11';
            }else if (where==3){
              var HOST = '10.30.0.100';
            }

            
            var message = new Buffer(string);

            var client = dgram.createSocket('udp4');

            
            client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
                console.log('UDP message sent to ' + HOST +':'+ PORT);
                client.close();
            });
  }

});







/*
Meteor.methods({
  addgeodata: function (lat, lon) {
    Userdata.insert({
      lat: lat,
      lon: lon,
      createdAt: new Date()
    });
  }



});

*/

/*
Meteor.method("geodata", function (data) {
  
  Geodatafinal.insert({
      deviceid: data["deviceid"],
      lat: data["lat"],
      lon: data["lng"],
      createdAt: new Date()
    });

    return "success";
}, {

  url: "geodata"
  
  }
)

Meteor.method("return-five", function () {

  Geodata.insert({
      fores: 5
    });

  return 5;
}, {
  url: "returnfive",
  httpMethod: "get"
  }
)
*/
