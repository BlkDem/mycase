
//device objects
const LightColor = 'zone1';
const ImpellerColor = 'zone2';
const CoolerColor = 'zone3';
const FrontColor = 'zone4';

const _zone1 = '#LightColor';
const _zone2 = '#ImpellerColor';
const _zone3 = '#CoolerColor';
const _zone4 = '#FrontColor';

//device mac
var _mac = '18:FE:34:FE:B6:90';

//mqtt client
client = new Paho.MQTT.Client('ice9.umolab.ru', Number(9883), '/wss', 'u1s-3679');

function RGB2Dec(picker)
{
	return Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
}

//change zone param/color via MQTT 
function update(picker, selector) {	  		
	  $(selector).val(picker.toString('hex'));
	  $(selector).click();
	  //var dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
	  var dec = RGB2Dec(picker);
	  console.log(selector + ' ->' + dec);
	  Publish(selector, dec);
}  

function updatePWM(_this)
{
    console.log(_this);
  SendToController('/'+_mac + '/pwm', _this.value);   
}

//recalc zones addresses  
function setRange()
{
	var _c2 = parseInt(document.querySelector('#count1').value)+1;
	var _c3 = parseInt(document.querySelector('#count2').value)+1;
	var _c4 = parseInt(document.querySelector('#count3').value)+1;
		
	document.querySelector('#caption_count1').innerHTML = ' 1 to ' + document.querySelector('#count1').value;
	document.querySelector('#caption_count2').innerHTML = ' ' + _c2 + ' to ' + document.querySelector('#count2').value;
	document.querySelector('#caption_count3').innerHTML = ' ' + _c3 + ' to ' + document.querySelector('#count3').value;
	document.querySelector('#caption_count4').innerHTML = ' ' + _c4 + ' to ' + document.querySelector('#count4').value;
}

//addresses sliders reacts	
function slideAddress(selector)
{
	setRange();
}

//subscribe MQTT topics
function SubscribeTopics()
{
	if (client.isConnected())
	{
		//base device parameters
	    client.subscribe('/'+_mac+'/IP');
		client.subscribe('/'+_mac+'/uptime');
		client.subscribe('/'+_mac+'/ssid');
		client.subscribe('/'+_mac+'/systime');
		
		//telemetry device parameters
		client.subscribe('/'+_mac+'/pressure');
		client.subscribe('/'+_mac+'/humidity');
		client.subscribe('/'+_mac+'/temp');
		client.subscribe('/'+_mac+'/tacho');
		
		//device custom parameters
		client.subscribe('/'+_mac+'/zone1'); //zone1 color
		client.subscribe('/'+_mac+'/zone2'); //zone2 color
		client.subscribe('/'+_mac+'/zone3'); //zone3 color
		client.subscribe('/'+_mac+'/zone4'); //zone4 color
		client.subscribe('/'+_mac+'/count1'); //zone1 address
		client.subscribe('/'+_mac+'/count2'); //zone2 address
		client.subscribe('/'+_mac+'/count3'); //zone3 address
		client.subscribe('/'+_mac+'/count4'); //zone4 address
		client.subscribe('/'+_mac+'/preset1/zone1'); //zone1 preset1 color
		client.subscribe('/'+_mac+'/preset1/zone2');
		client.subscribe('/'+_mac+'/preset1/zone3');
		client.subscribe('/'+_mac+'/preset1/zone4');
		client.subscribe('/'+_mac+'/preset2/zone1'); //zone1 preset2 color
		client.subscribe('/'+_mac+'/preset2/zone2');
		client.subscribe('/'+_mac+'/preset2/zone3');
		client.subscribe('/'+_mac+'/preset2/zone4');
		client.subscribe('/'+_mac+'/pwm');
	}
}

//change zone address  
function addressChange(value)
{
	SendToController('/'+_mac+'/'+value, $('#'+value).val());
}

//led strip OFF  
function zonesOff()
{
    SendToController('/'+_mac+'/cmd', 0);
}
  
//led strip ON
function zonesOn()
{
	SendToController('/'+_mac+'/cmd', 1);
}

//3D scene loaded event  
function SceneLoaded()
{
	SubscribeTopics();
	$('#id_caption').text("Umbrella");
}


// :)  
function HideCr()
{
	$('#my_id').attr('style', 'display:none');
}

// save zones preset   
function savePreset(_this, zone)
{
    var _z = zone.substr(9);
	var index = parseInt(zone[7]);
	var _topic = '/' + _mac + '/preset' + index.toString() + '/' + _z;
	var picker = document.querySelector('#preset' + index.toString() + '_' +_z).jscolor;
	var _dec = RGB2Dec(picker);
	console.log(_topic + ' -> ' + _dec);
	SendToController(_topic, _dec);
}

//send to MQTT   
function SendToController(topic, value)
{
	//console.log(value);
	var message = new Paho.MQTT.Message(value.toString());
	message.destinationName = topic;
	message.qos = 0;
	message.retained = true;
	client.send(message);
	console.log(topic + ' -> ' + value);
}

// set zone value
function Publish(zone, value)
{
	switch (zone.substr(1))
	{
		case 'LightColor': SendToController('/'+_mac + '/' + LightColor, value); break;
		case 'ImpellerColor': SendToController('/'+_mac + '/' + ImpellerColor, value); break;
		case 'CoolerColor': SendToController('/'+_mac + '/' + CoolerColor, value); break;
		case 'FrontColor': SendToController('/'+_mac + '/' + FrontColor, value); break;
		default: break;
	}
}

//save current color preset (index)	
function fromCurrent(index)
{
	document.querySelector('#preset'+index+'_zone1').jscolor.fromString(document.querySelector(_zone1).jscolor.toString()); //copy color from color picker to preset color (index)
	document.querySelector('#preset'+index+'_zone2').jscolor.fromString(document.querySelector(_zone2).jscolor.toString());
	document.querySelector('#preset'+index+'_zone3').jscolor.fromString(document.querySelector(_zone3).jscolor.toString());
	document.querySelector('#preset'+index+'_zone4').jscolor.fromString(document.querySelector(_zone4).jscolor.toString());
	var picker = document.querySelector('#preset'+index+'_zone1').jscolor;
	var _dec = RGB2Dec(picker);
	var _tmp = '/'+_mac+'/preset'+index.toString()+'/zone1';
	console.log(_tmp + ' _ ' + _dec);	
	SendToController(_tmp, _dec);
	picker = document.querySelector('#preset'+index+'_zone2').jscolor;
	_dec = RGB2Dec(picker);
	SendToController('/'+_mac+'/preset'+index.toString()+'/zone2', _dec);
	picker = document.querySelector('#preset'+index+'_zone3').jscolor;
	_dec = RGB2Dec(picker);
	SendToController('/'+_mac+'/preset'+index.toString()+'/zone3', _dec);		
	picker = document.querySelector('#preset'+index+'_zone4').jscolor;
	_dec = RGB2Dec(picker);
	SendToController('/'+_mac+'/preset'+index.toString()+'/zone4', _dec);	
}

//load color zones preset (index)
function applyPreset(index)
{
	document.querySelector(_zone1).jscolor.fromString(document.querySelector('#preset'+index+'_zone1').jscolor.toString()); //copy color from preset picker (preset index)
	document.querySelector(_zone2).jscolor.fromString(document.querySelector('#preset'+index+'_zone2').jscolor.toString());
	document.querySelector(_zone3).jscolor.fromString(document.querySelector('#preset'+index+'_zone3').jscolor.toString());
	document.querySelector(_zone4).jscolor.fromString(document.querySelector('#preset'+index+'_zone4').jscolor.toString());
	var picker = document.querySelector(_zone1).jscolor;
	var _dec = RGB2Dec(picker);
	SendToController('/'+_mac+'/zone1', _dec);			
	picker = document.querySelector(_zone2).jscolor;
	_dec = RGB2Dec(picker);
	SendToController('/'+_mac+'/zone2', _dec);			
	picker = document.querySelector(_zone3).jscolor;
	_dec = RGB2Dec(picker);
	SendToController('/'+_mac+'/zone3', _dec);	
	picker = document.querySelector(_zone4).jscolor;
	_dec = RGB2Dec(picker);
	SendToController('/'+_mac+'/zone4', _dec);	
}
  

// set callback handlers
client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: "+responseObject.errorMessage);
}

//MQTT messages handler
client.onMessageArrived = function (message) {
  //console.log("Message Arrived: "+message.payloadString + ' ->' + message.destinationName);
  var _msg_name = message.destinationName.substr(19);
  var _selector = '';
  var _msg = '';
  if (_msg_name.substring(0, 4)==='zone')
  {
	_msg = '#'+parseInt(message.payloadString).toString(16).padStart(6, '0'); // hex color format #0000FA
	switch (_msg_name) {
	  case 'zone1': _selector = _zone1;break;
	  case 'zone2': _selector = _zone2;break;
	  case 'zone3': _selector = _zone3;break;	  
	  case 'zone4': _selector = _zone4;break;
	  default: _selector = '';break;
	}
  
  //console.log('zone: ' + _selector + ' payload: ' + _msg);  
    if (_selector != '')
    {
	  var _tmpSelector = document.querySelector(_selector);
	  if (_tmpSelector.jscolor.toString() != _msg)
	  {
		_tmpSelector.jscolor.fromString(_msg);
		_tmpSelector.value = _msg;
		_tmpSelector.click();
	  }
    }
  }


  if (_msg_name.indexOf('count') !== -1) //recieving zone addresses
  {
	console.log('count: ' + _msg_name + ' payload: ' + message.payloadString);
	document.querySelector('#'+_msg_name).value = parseInt(message.payloadString);
	setRange();
  }
  
  if (_msg_name.indexOf('temp') !== -1) //recieving telemetry (temperature)
  {
	console.log('Temperature: ' + _msg_name + ' payload: ' + message.payloadString);
	document.querySelector('#'+_msg_name).innerHTML = message.payloadString;
  }
  if (_msg_name.indexOf('tacho') !== -1) //recieving coolers rotation
  {
	console.log('Tacho: ' + _msg_name + ' payload: ' + message.payloadString);
	document.querySelector('#'+_msg_name).innerHTML = message.payloadString;
  }
  if (_msg_name.indexOf('pressure') !== -1) //recieving telemetry (pressure)
  {
	console.log('Pressure: ' + _msg_name + ' payload: ' + message.payloadString);
	document.querySelector('#'+_msg_name).innerHTML = message.payloadString;
  }
  if (_msg_name.indexOf('pwm') !== -1) //recieving telemetry (pressure)
  {
	document.querySelector('#pwm').value = message.payloadString;
  }
  
  if (_msg_name.indexOf('preset') !== -1) //recieving presets
  {
	console.log('preset: ' + _msg_name[6] + ' - ' + _msg_name.substr(8) + ' payload: ' + message.payloadString);
	document.querySelector('#preset' + _msg_name[6] + '_' + _msg_name.substr(8)).jscolor.fromString(parseInt(message.payloadString).toString(16).padStart(6, '0'));
	//document.querySelector('#'+_msg_name).value = parseInt(message.payloadString);
	//setRange();
  }
}

// Called when the connection is made
function onConnect(){
	console.log('Connected! ');
	console.log('Subscribing...');
	setTimeout(SubscribeTopics, 1000);	
}

// Connect the client, providing an onConnect callback
client.connect({
	onSuccess: onConnect, 
	useSSL: true,
	userName : 'umolab',
	password : ''
});