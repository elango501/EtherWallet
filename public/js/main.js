//var fs = require('fs');
var walletaddress;
var provider;
$(document).ready(function() {
	document.getElementById("walletinfo").style.visibility = "hidden";
	document.getElementById("wallettransfer").style.visibility = "hidden";
	document.getElementById("info").innerHTML = "Ethereum HD Wallet - Load Existing Wallet / Create New Wallet";
	getProvider();
	$('#uploadForm').submit(function() {
		if( document.getElementById("customfile").files.length == 0 ){
			document.getElementById("info").innerHTML="No KeyStore File was uploaded";
			return false;

}
        $(this).ajaxSubmit({
            error: function(xhr) {
        status('Error: ' + xhr.status);
            },
            success: function(response) {
							document.getElementById("info").innerHTML="Please wait Validating and Loading Wallet...";
				 var trimseed=response.replace(/["']/g, "");
              generate_addresses(trimseed,false);
            }
    });

    return false;
    });
});


function generate_seed()
{
	var new_seed = lightwallet.keystore.generateRandomSeed();
	document.getElementById("info").innerHTML="Creating New Wallet...Hold on..";
	generate_addresses(new_seed,true);
}

var totalAddresses = 1;

function generate_addresses(seed,isNewLoad)
{



	if(!lightwallet.keystore.isSeedValid(seed))
	{
		document.getElementById("info").innerHTML = "Please enter a valid seed";
		return;
	}



var password = Math.random().toString();

	lightwallet.keystore.createVault({
		password: password,
	  	seedPhrase: seed
	}, function (err, ks) {
	  	ks.keyFromPassword(password, function (err, pwDerivedKey) {
	    	if(err)
	    	{
	    		document.getElementById("info").innerHTML = err;
	    	}
	    	else
	    	{
	    		ks.generateNewAddress(pwDerivedKey, totalAddresses);
					console.log(ks);
	    		var addresses = ks.getAddresses();

	    		var web3 = new Web3(new Web3.providers.HttpProvider(provider));

	    		var html = "";

	    		for(var count = 0; count < addresses.length; count++)
	    		{
					var address = addresses[count];
					var private_key = ks.exportPrivateKey(address, pwDerivedKey);
					var balance = web3.eth.getBalance("0x" + address);

					html = html + "<li>";
					html = html + "<p><b>Address: </b>0x" + address + "</p>";
					html = html + "<p><b>Private Key: </b>0x" + private_key + "</p>";
					html = html + "<p><b>Balance: </b>" + web3.fromWei(balance, "ether") + " ether</p>";
		    		html = html + "</li>";
						walletaddress=address;
	    		}

	    		document.getElementById("list").innerHTML = html;
					if (isNewLoad) {
					DownloadWallet(seed,address);
				}
				if (!isNewLoad) {
					document.getElementById("info").innerHTML = "Wallet Loaded Successfully";
				}
				document.getElementById("walletinfo").style.visibility = "visible";

				document.getElementById("wallettransfer").style.visibility = "visible";
	    	}
	  	});
	});

}

function DownloadWallet(seed,address){
	$.ajax({
		 url: "/Download",
		 data: {'seed':seed,'address':address,'utc':new Date()},
	 type: "GET", // if you want to send data via the "data" property change this to "POST". This can be omitted otherwise
		 success: function(responseData) {
			 console.log(responseData);
			 var pathtodownload="/Downloads/"+address+".keystore";
				document.getElementById("info").innerHTML = "Download KeyStore File <a href='"+pathtodownload+"'>Here</a>";
		 },
		 error: function (err) {
		 	console.log(err);
		 }
	 });
}

function getProvider(){
	$.ajax({
		 url: "/walletprovider",
	 type: "GET",
		 success: function(responseData) {
		provider = responseData;
		 },
		 error: function (err) {
			console.log(err);
		 }
	 });
}

function send_ether()
{
			    var web3 = new Web3(provider);
				var to = document.getElementById("address2").value;
			    var value = web3.toWei(document.getElementById("ether").value, "ether");

			    web3.eth.sendTransaction({
			    	from: "0x"+walletaddress,
			    	to: to,
			    	value: value,
			    	gas: 21000
			    }, function(error, result){
			    	if(error)
			    	{
			    		document.getElementById("info").innerHTML = error;
			    	}
			    	else
			    	{
			    		document.getElementById("info").innerHTML = "Txn hash: " + result;
			    	}
			    });

}
