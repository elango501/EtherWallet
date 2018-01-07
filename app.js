var express = require("express");
var app = express();
var filemanager = require('./FileManager.js');
var multer=require('multer');
var config= require('config');

app.use(express.static(__dirname+"/public/"));
//app.use(express.static("/Final/public/Downloads/"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
})
app.get("/Download",(req,res)=>{
var address = req.query.address;
var seed = req.query.seed;
var utc = req.query.utc;
var result=filemanager.writeKeyStore(seed,address,utc);
res.send(result);
});
app.get("/walletprovider",(req,res)=>{
var provider =config.get('Wallet.Web3Provider').Provider;
res.send(provider);
});

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './Uploads')
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname);
      }
});

app.post('/LoadWallet',(req,res)=>{
	var upload = multer({
		storage: storage
	}).single('userFile')
	upload(req, res, function(err) {
	var seed=filemanager.readKeyStore(req.file.filename);
	res.send(seed);
	})
});
app.listen(8080);
