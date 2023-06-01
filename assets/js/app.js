	const idxCount = 10;
	const idxZone = 6;
	const idxPreset1 = 11;
	const idxPreset2 = 3;
	const idxBMx = 2;
	const idxRPM = 2;

	function updateTelemetry()
	{
		console.log("updating telemetry");
		loadParams(idxBMx, "Temperature", 0);
		loadParams(idxBMx, "Pressure", 0);
		loadParams(idxRPM, "rpmvalue", 0); //tacho
		setTimeout(updateTelemetry, 10000);
	}
		
	function addressChange(selector)
	{
		rangeSetup(selector.substr(5), document.querySelector('#'+selector).value);		
	}

	function setRange()
	{
		var _c2 = parseInt(document.querySelector('#count1').value)+1;
		var _c3 = parseInt(document.querySelector('#count2').value)+1;
		var _c4 = parseInt(document.querySelector('#count3').value)+1;
		
		document.querySelector('#caption_count1').innerHTML = ' 0 to ' + document.querySelector('#count1').value;
		document.querySelector('#caption_count2').innerHTML = ' ' + _c2 + ' to ' + document.querySelector('#count2').value;
		document.querySelector('#caption_count3').innerHTML = ' ' + _c3 + ' to ' + document.querySelector('#count3').value;
		document.querySelector('#caption_count4').innerHTML = ' ' + _c4 + ' to ' + document.querySelector('#count4').value;
		
	}
	
	function slideAddress(selector)
	{
		//document.querySelector('#caption_'+selector).innerHTML = document.querySelector('#'+selector).value;
		setRange();
		//document.querySelector('#caption_'+selector).innerHTML = _dia;
	}

	function zoneControl(zone, value)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "/control?cmd=event,zoneControl=" + zone.substr(4) + "," + value);
		xhr.send();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			if (this.status != 200) {
				console.log('error');
			return;
			}
		}
	}
	
	function rangeSetup(zoneid, value)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "/control?cmd=event,rangeSetup=" + zoneid + "," + value);
		xhr.send();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			if (this.status != 200) {
				console.log('error');
			return;
			}
		}
	}

	function presetSetup(zone, dec, index)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "/control?cmd=event,preset=" + index + "," + zone + "," + dec);
		xhr.send();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			if (this.status != 200) {
				console.log('error');
				return;
			}	
		}
	}
	
	function presetLoad(zone, dec)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "/control?cmd=event,presetLoad=" + zone + "," + dec);
		xhr.send();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			if (this.status != 200) {
				console.log('error');
				return;
			}
		}
	}
	
	function zonesOff()
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "/control?cmd=event,zonesOff");
		xhr.send();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			if (this.status != 200) {
				console.log('error');
				return;
			}
		}
	}

	function zonesOn()
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "/control?cmd=event,zonesOn");
		xhr.send();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			if (this.status != 200) {
				console.log('error');
				return;
			}
		}
	}
	
	function update(picker, selector) {
		document.querySelector(selector).style.background = picker.toBackground();
		var dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		var _zone = selector.substr(1);
		picker.hide();
		zoneControl(_zone, dec);
	}
	
	function updatePreset(picker, selector, index) {
		document.querySelector(selector).style.background = picker.toBackground();
		var dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		var _zone = selector.substr(13);		
		picker.hide();
		presetSetup(_zone, dec, index);
	}
	
	function zoneOff(selector)
	{
	    document.querySelector(selector).jscolor.fromRGBA(0,0,0,0);
	    zoneControl(selector.substr(1), 0);
	}
	
	function loadParams(task, value, atype, prefix)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "/json?tasknr=" + task + "&view=sensorupdate");
		xhr.send();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;

			if (this.status != 200) {
				//alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
				return;
			}
		
			var jsonData = JSON.parse(this.responseText);
		
				for (let i = 0; i < jsonData.TaskValues.length; i++) {
					let app = jsonData.TaskValues[i];
					if (app.Name==value)
					{
						if (atype == 0)
						{
						  document.querySelector('#'+value).innerHTML=app.Value;
						}
						if (atype == 1)
						{
							console.log('Color: ' + app.Value + ' - ' + app.Value.toString(16));
							if (app.Value == 0) 
							{
								document.querySelector('#'+prefix+app.Name).jscolor.fromString('#000000');
							}
							else
							{
								document.querySelector('#'+prefix+app.Name).jscolor.fromString('#'+app.Value.toString(16).padStart(6, '0'));
							}
						}
						if (atype == 2)
						{
							document.querySelector('#'+value).value=app.Value;
							document.querySelector('#caption_'+value).innerHTML=app.Value;
						} 
						
					}
				}
		}
	}
		
	function fromCurrent(index)
	{
		document.querySelector('#preset'+index+'_zone1').jscolor.fromString(document.querySelector('#zone1').jscolor.toString());
		document.querySelector('#preset'+index+'_zone2').jscolor.fromString(document.querySelector('#zone2').jscolor.toString());
		document.querySelector('#preset'+index+'_zone3').jscolor.fromString(document.querySelector('#zone3').jscolor.toString());
		document.querySelector('#preset'+index+'_zone4').jscolor.fromString(document.querySelector('#zone4').jscolor.toString());
		var picker = document.querySelector('#preset'+index+'_zone1').jscolor;
		var _dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetSetup(1, _dec, index);
		picker = document.querySelector('#preset'+index+'_zone2').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetSetup(2, _dec, index);
		picker = document.querySelector('#preset'+index+'_zone3').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetSetup(3, _dec, index);
		picker = document.querySelector('#preset'+index+'_zone4').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetSetup(4, _dec, index);
	}
	
	function applyPreset(index)
	{
		document.querySelector('#zone1').jscolor.fromString(document.querySelector('#preset'+index+'_zone1').jscolor.toString());
		document.querySelector('#zone2').jscolor.fromString(document.querySelector('#preset'+index+'_zone2').jscolor.toString());
		document.querySelector('#zone3').jscolor.fromString(document.querySelector('#preset'+index+'_zone3').jscolor.toString());
		document.querySelector('#zone4').jscolor.fromString(document.querySelector('#preset'+index+'_zone4').jscolor.toString());
		var picker = document.querySelector('#zone1').jscolor;
		var _dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetLoad(1, _dec);
		picker = document.querySelector('#zone2').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetLoad(2, _dec);
		picker = document.querySelector('#zone3').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetLoad(3, _dec);
		picker = document.querySelector('#zone4').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetLoad(4, _dec);
		
	}
		loadParams(idxCount, "count1", 2, '');
		loadParams(idxCount, "count2", 2, '');
		loadParams(idxCount, "count3", 2, '');
		loadParams(idxCount, "count4", 2, '');
		
		loadParams(idxZone, "zone1", 1, '');
		loadParams(idxZone, "zone2", 1, '');
		loadParams(idxZone, "zone3", 1, '');
		loadParams(idxZone, "zone4", 1, '');

		loadParams(idxPreset1, "zone1", 1, 'preset1_');
		loadParams(idxPreset1, "zone2", 1, 'preset1_');
		loadParams(idxPreset1, "zone3", 1, 'preset1_');
		loadParams(idxPreset1, "zone4", 1, 'preset1_');
		loadParams(idxPreset2, "zone1", 1, 'preset2_');
		loadParams(idxPreset2, "zone2", 1, 'preset2_');
		loadParams(idxPreset2, "zone3", 1, 'preset2_');
		loadParams(idxPreset2, "zone4", 1, 'preset2_');
		
		updateTelemetry();
		
		setTimeout(setRange, 3000);
		setRange();
		
  let preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }