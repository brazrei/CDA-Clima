<?php
    $data = $_POST['metares'];
    $ip = $_POST['ip'];
    $FIR = $_POST['FIR'];
    //set mode of file to writable.
    $filename = "website-contents-".$ip."FIR".$FIR.".json";
    chmod($filename,0777);
    $f = fopen($filename, "w+") or die("fopen failed");
    fwrite($f, $data);
    fclose($f);
?>