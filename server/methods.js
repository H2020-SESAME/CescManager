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
  addDeployed: function (nsid, nsname, nsconf) {
    return DeployedNetworkServices.insert({
      nsid: nsid,
      nsname: nsname,
      nsconf: nsconf,
      started: 2,
      createdAt: new Date()
    });
  },
  deployedState: function (dnsid, state) {
      DeployedNetworkServices.update({ _id: dnsid }, { $set: {started: state} });
  },
  removeDeployed: function (dnsid) {
      DeployedNetworkServices.remove(dnsid);
  },
  
  tenorCallAdd: function (dnsid) {
		  var updateData = {
	   data: {
		  "ns_id": "578e2db5e4b0356a4eb0d2b76",
		  "callbackUrl": "https://httpbin.org/post",
		  "flavour": "basic"
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
	   }
		
	});
  },
  
  tenorCallDel: function (dnsid) {
	var deleteData = {
	   data: {}
	}

	HTTP.del( 'http://localhost:4000/ns-instances/578e2db5e4b0356a4eb0d2b76', deleteData, 
	   function( error, response ) {
		
	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
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
