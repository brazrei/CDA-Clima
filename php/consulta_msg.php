<?php
  
  function deleteOldFiles($idade = 5) { //idade em minutos
    $folderName = "cache";
    if (file_exists($folderName)) {
      foreach (new DirectoryIterator($folderName) as $fileInfo) {
        if ($fileInfo->isDot()) {
          continue;
        }
        if ($fileInfo -> isFile() && time() - $fileInfo -> getCTime() >= $idade * 60) {
          unlink($fileInfo->getRealPath());
        }
      }
    }
  }
  
  function setProxy() {
    $PROXY_HOST = "proxy.decea.intraer"; // Proxy server address
    $PROXY_PORT = "8080";    // Proxy server port
    $PROXY_USER = "brazrab";    // Username
    $PROXY_PASS = "12345678";   // Password
    // Username and Password are required only if your proxy server needs basic authentication
    
    $auth = base64_encode("$PROXY_USER:$PROXY_PASS");
    stream_context_set_default(
     array(
      'http' => array(
       'proxy' => "tcp://$PROXY_HOST:$PROXY_PORT",
       'request_fulluri' => true,
       'header' => "Proxy-Authorization: Basic $auth"
       // Remove the 'header' option if proxy authentication is not required
      )
     )
    );
  }    

  function getCurl($url) {
    $ch = curl_init($url);
    $timeout = 45;

    //curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);

    $result = curl_exec($ch);
    curl_close($ch);
    
    return $result;
  }

  function getProxy() {
    $proxy = "&proxy=false"; 
    if ( isset($_GET['proxy']) && ($_GET['proxy'] == "true") )
      $proxy = "&proxy=true"; 
    return $proxy;
  }

  function limpaToken() {
    file_get_contents("http://localhost/WebServiceOPMET/getAuthToken.php?update=true&proxy=true" . getProxy());
  }

  $urlF = $urlF . getProxy(); 
  deleteOldFiles(10); //tempo em minutos
  include('top-cache.php'); 

  // Your regular PHP code goes here
  //  $testeParam = $_POST['testeParam'];
  //$local = $_GET['local'];
  //$urlF = $url.'?local='.$local.'&msg=metar';
 // echo ($urlF);
  //echo $urlF;
  //$response = getCurl($urlF);
  $response = file_get_contents($urlF);

  if ( preg_replace('/\s+/', '', $response) == "") //remove todos os caracteres especiais se a msg for vazia
    $response = "";

  echo $response;
  if ( $response == "" ) {
    //echo "Erro na consulta em consulta_msg.php! Resposta vazia do servidor!";
    exit;
  } else if (strpos(strtoupper($response),"FORBIDDEN")) {
    //echo "Erro na consulta em consulta_msg.php! Acesso negado! Token pode estar expirado!";
    limpaToken();
    exit;
  }
  include('bottom-cache.php');
?>

