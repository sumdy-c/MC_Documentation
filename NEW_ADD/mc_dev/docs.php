<?php

	require_once '../../autoload.php';
    if(!User::isAuthorized() || (User::current())->isUser()) {
        System::redirect('../view.php');
    } else if (!User::getAuthUser()->isAdmin() && !User::getAuthUser()->isSuperAdmin()) {
        System::redirect('../view.php');
    }
?>

<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MC v8.1 - Micro Component Documentation</title>
<link rel="alternate" type="text/markdown" title="MC.js AI Markdown Documentation" href="../clientscript/MicroComponent/MC.ai.md">
<meta name="mc-ai-docs" content="../clientscript/MicroComponent/MC.ai.md">
<link rel="stylesheet" href="./reset.css">
<link rel="stylesheet" href="./docs_page.css">
<script src="../template/jquery-ui/jquery.min.js" type="text/javascript"></script>
<script src="../clientscript/MicroComponent/MC.js"></script>
<script type="module" src="./docs_app.js"></script>
</head>
<body class="mc-docs-page">
    <div id="root"></div>
</body>
</html>
