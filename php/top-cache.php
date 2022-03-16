<?php
  set_time_limit(0);

  function makeArgs() {
    $args = "";
    $sep = "";
    //echo sizeof($_GET);
    //if (sizeof($_GET) < 2)
    //  return "";
    foreach ($_GET as $key => $value) {
      if ($key !== "url" && $key && $key !== "_") {
        $args = $args . $sep . $key . "=" . $value;
        $sep = "&";
      }
    }
    return $args;
  }
  $url = $_SERVER["SCRIPT_NAME"];
  $break = Explode('/', $url);
  $file = $break[count($break) - 1];

  //$teste = "http://www.redemet.intraer//api/consulta_automatica/index.php?local=SBEG,SBMN,SBBV,SBPV,SBRB,SBCY,SBSL,SBBE,SBJC,SBSN,SBMQ,SBCZ,SBTF,SBMY,SBAT,SBUA,SBCC,SBSO,SBIH,SBTT,SBTK,SBJI,SBHT,SBMA,SBVH,SBTU,SBOI,SBCJ,SBCI,SBIZ,SBTS,SBTB,SBUY,SBIC,SBEK,SBGM,SBMD,SBAA,SBRD,SSKW,SBSI&msg=metar";
  //$encrypted_url = hash('sha256',$_POST['urlConsulta']);
  //$urlF = $teste;

  $args = makeArgs();
  $urlF = $_GET['url'];
  //echo "urlF = $urlF\n";
  if ($args !== "")
    $urlF = $urlF . "&" . $args;

  //echo "args = $args\n";

  $encrypted_url = hash('sha256',$urlF);

  $dirName = "cache";
  if (!file_exists($dirName)) {
     //mkdir($dirName, 0777);
     if (!@mkdir($dirName, 0777)) {
      $error = error_get_last();
      echo $error['message'];
  }
  }
  $cachefile = $dirName . "/" . 'cached-'.substr_replace($file ,"",-4).$encrypted_url.'.html';
  $cachetime = 50;

  // Serve from the cache if it is younger than $cachetime
  if (file_exists($cachefile) && time() - $cachetime < filemtime($cachefile)) {
      echo "<!-- Cached copy, generated ".date('H:i', filemtime($cachefile))." -->\n";
      readfile($cachefile);
      exit;
  }
  ob_start(); // Start the output buffer
?>
