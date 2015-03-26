<?php

function file_rename( $file ) {

	$mime_types = array(
		// audio/video
		'mp3' => 'audio/mpeg',
		'qt' => 'video/quicktime',
		'mov' => 'video/quicktime',
		'flv' => 'video/x-flv',
	);
	return date("d_m_y_H_i_s")  ;//array_search( $file , $mime_types );
}


function bytesToSize1024($bytes, $precision = 2) {
    $unit = array('B','KB','MB');
    return @round( $bytes / pow( 1024 , ( $i = floor( log( $bytes , 1024 ) ) ) ) , $precision ) . ' ' . $unit[$i];
}


$sFileName = $_FILES['media_file']['name'];
$sFileType = $_FILES['media_file']['type'];
$sFileSize = bytesToSize1024($_FILES['media_file']['size'], 1);
//echo $_FILES['media_file']['tmp_name'];

$newFileName = str_replace( ".3gpp", '.mp3', $sFileName );
$newFileName = str_replace( ".mov" , '.mp3', $sFileName );

if ( move_uploaded_file( $_FILES['media_file']['tmp_name'] , "uploads/{$sFileName}" ) ) {
	$realpath = realpath( '.' );
	$srcFile  = "{$realpath}/uploads/{$sFileName}";
	$destFile = "{$realpath}/uploads/{$newFileName}";
	//$cmd = "/usr/bin/ffmpeg -y -i {$srcFile} {$destFile} 2>&1";
	//exec( $cmd );
}

echo <<<EOF
<p>Your file: {$sFileName} has been successsfully received.</p>
<p>Type: {$sFileType}</p>
<p>Size: {$sFileSize}</p>
<p><audio src="uploads/{$newFileName}" controls></audio></p>
EOF;
?>