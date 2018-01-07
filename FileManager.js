var fs = require('fs');
var multer = require('multer');
var config= require('config');
var writeKeyStore=(seed,address,utc)=>{
  try{
    var downloadpath =config.get('Wallet.DownloadPath').Path;
   	fs.writeFile(downloadpath+address+".keystore",seed,function(err){
      if (err) {
        console.log(err);
      }
    });
    return address;
}
catch(e){

};
}

var readKeyStore=(filename)=>{
  try{
    var uploadpath =config.get('Wallet.UploadPath').Path;
  var seed=fs.readFileSync(uploadpath+filename,"utf8");
  return JSON.stringify(seed);

}
catch(e){
return e;
}

}


module.exports={
  writeKeyStore,
  readKeyStore
}
