<?php

function bytesToSize1024($bytes, $precision = 2) {
    $unit = array('B','KB','MB');
    return @round( $bytes / pow( 1024 , ( $i = floor( log( $bytes , 1024 ) ) ) ) , $precision ) . ' ' . $unit[$i];
}

$sFileName = $_FILES['image_file']['name'];
$sFileType = $_FILES['image_file']['type'];
$sFileSize = bytesToSize1024($_FILES['image_file']['size'], 1);
//echo $_FILES['image_file']['tmp_name'];

if ( move_uploaded_file( $_FILES['image_file']['tmp_name'] , "uploads/".$_FILES['image_file']['name'] ) ) {
	$realpath = realpath( '.' );
	$srcFile  = "{$realpath}/uploads/capturedvideo.MOV";
	$destFile = "{$realpath}/uploads/test.wav";
	$cmd = "/usr/bin/ffmpeg -y -i {$realpath}/uploads/capturedvideo.MOV {$realpath}/uploads/test.wav 2>&1";
	exec( $cmd );
}



echo <<<EOF
<p>Your file: {$sFileName} has been successsfully received.</p>
<p>Type: {$sFileType}</p>
<p>Size: {$sFileSize}</p>
<p>You can play back the audio <a href="wave_form.php">here</a></p>
<p><audio src="uploads/test.wav" controls></audio></p>
EOF;
?>