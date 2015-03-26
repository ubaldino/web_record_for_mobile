// common variables
var iBytesUploaded = 0;
var iBytesTotal = 0;
var iPreviousBytesLoaded = 0;
var iMaxFilesize = 1048576; // 1MB
var oTimer = 0;
var sResultFileSize = '';


function navigator_detect(){
	var dispositivo = navigator.userAgent.toLowerCase();
	return (
			dispositivo.match(/Android/i) ||
			dispositivo.match(/webOS/i)   ||
			dispositivo.match(/iPhone/i)  ||
			dispositivo.match(/iPad/i)    ||
			dispositivo.match(/iPod/i)    ||
			dispositivo.match(/BlackBerry/i) ||
			dispositivo.match(/Windows Phone/i) ||
			["desktop"]
          )[0];
}


function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

function uploadProgress(e) { // upload process in progress
    if (e.lengthComputable) {
        iBytesUploaded = e.loaded;
        iBytesTotal = e.total;
        var iPercentComplete = Math.round(e.loaded * 100 / e.total);
        var iBytesTransfered = bytesToSize(iBytesUploaded);

        document.getElementById('progress_percent').innerHTML = iPercentComplete.toString() + '%';
        document.getElementById('progress').style.width = (iPercentComplete * 4).toString() + 'px';
        document.getElementById('b_transfered').innerHTML = iBytesTransfered;
        if (iPercentComplete == 100) {
            var oUploadResponse = document.getElementById('upload_response');
            oUploadResponse.innerHTML = '<h1>Please wait...processing</h1>';
            oUploadResponse.style.display = 'block';
        }
    } else {
        document.getElementById('progress').innerHTML = 'unable to compute';
    }
}

function uploadFinish(e) { // upload successfully finished
    var oUploadResponse = document.getElementById('upload_response');
    oUploadResponse.innerHTML = e.target.responseText;
    oUploadResponse.style.display = 'block';

    document.getElementById('progress_percent').innerHTML = '100%';
    document.getElementById('progress').style.width = '400px';
    document.getElementById('filesize').innerHTML = sResultFileSize;
    document.getElementById('remaining').innerHTML = '| 00:00:00';

    clearInterval(oTimer);
}


function uploadError(e) { // upload error
    document.getElementById('error2').style.display = 'block';
    clearInterval(oTimer);
}

function uploadAbort(e) { // upload abort
    document.getElementById('abort').style.display = 'block';
    clearInterval(oTimer);
}

function doInnerUpdates() { // we will use this function to display upload speed
    var iCB = iBytesUploaded;
    var iDiff = iCB - iPreviousBytesLoaded;

    // if nothing new loaded - exit
    if (iDiff == 0)
        return;

    iPreviousBytesLoaded = iCB;
    iDiff = iDiff * 2;
    var iBytesRem = iBytesTotal - iPreviousBytesLoaded;
    var secondsRemaining = iBytesRem / iDiff;

    // update speed info
    var iSpeed = iDiff.toString() + 'B/s';
    if (iDiff > 1024 * 1024) {
        iSpeed = (Math.round(iDiff * 100/(1024*1024))/100).toString() + 'MB/s';
    } else if (iDiff > 1024) {
        iSpeed =  (Math.round(iDiff * 100/1024)/100).toString() + 'KB/s';
    }

    document.getElementById('speed').innerHTML = iSpeed;
    document.getElementById('remaining').innerHTML = '| ' + secondsToTime(secondsRemaining);        
}

function secondsToTime(secs) { // we will use this function to convert seconds in normal time format
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

    if (hr < 10) {hr = "0" + hr; }
    if (min < 10) {min = "0" + min;}
    if (sec < 10) {sec = "0" + sec;}
    if (hr) {hr = "00";}
    return hr + ':' + min + ':' + sec;
};




$(document).ready( function() {

	$("#device_info").html( navigator_detect() );


	switch( navigator_detect() ){
		case "android":
			$("#media_file").attr( 'accept' , 'audio/*' ) ;
			break;
		case "ipad":
			$("#media_file").attr( 'accept' , 'video/*' ) ;
			break;

	}

	$("#media_file").bind( 'change' , function(){ 
		
		oFile = $(this)[0].files[0];

		console.log( oFile.name );
		console.log( oFile.type );
		console.log( bytesToSize( oFile.size ) );
		console.log( oFile.webkitRelativePath );

		/*
		alert( 

			oFile.name + "\n" +
			oFile.type + "\n" +
			bytesToSize( oFile.size ) + "\n" +
			oFile.webkitRelativePath + "\n" 

		);
		*/

		// get form data for POSTing
	    //var vFD = document.getElementById('upload_form').getFormData(); // for FF3
	    var vFD = new FormData( $('#upload_form')[0] ); 

	    // create XMLHttpRequest object, adding few event listeners, and POSTing our data
	    var oXHR = new XMLHttpRequest();        
	    oXHR.upload.addEventListener( 'progress', uploadProgress , false);
	    oXHR.addEventListener('load', uploadFinish, false);
	    oXHR.addEventListener('error', uploadError, false);
	    oXHR.addEventListener('abort', uploadAbort, false);
	    oXHR.open('POST', 'upload.php');
	    oXHR.send( vFD );

	    // set inner timer
	    oTimer = setInterval(doInnerUpdates, 300);


	});


});

