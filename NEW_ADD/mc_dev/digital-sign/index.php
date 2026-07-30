<?php

require_once '../../../autoload.php';

?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../reset.css">
    <link rel="stylesheet" href="../ui_page.css">
    <title>Электронная подпись</title>
    <script src="../../template/jquery-ui/jquery.min.js" type="text/javascript"></script>
    <script src="../../clientscript/MicroComponent/MC.js"></script>
    <script src="./cadesplugin_api.js"></script>
    <script>
        window.DS_DOCUMENT_ID = <?= (int)($_GET['id'] ?? 0) ?>;
    </script>
    <script src="./crypto.js"></script>
    <script src="./sign.js"></script>
</head>
<body>
    <div id="root"></div>
</body>
</html>
