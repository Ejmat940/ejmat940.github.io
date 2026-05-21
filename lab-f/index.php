<?php
require_once __DIR__ . '/autoload.php';

use App\CsvEncoder;
use App\JsonEncoder;
use App\YamlEncoder;
use App\SsvEncoder;
use App\TsvEncoder;

$inputOption = $_POST['inputOption'] ?? '';
$inputText   = $_POST['inputText'] ?? '';
$outputOption = $_POST['outputOption'] ?? '';
$outputText = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    switch ($outputOption) {
        case 'CSV':
            $encoder = new CsvEncoder();
            break;
        case 'SSV':
            $encoder = new SsvEncoder();
            break;
        case 'TSV':
            $encoder = new TsvEncoder();
            break;
        case 'JSON':
            $encoder = new JsonEncoder();
            break;
        case 'YAML':
            $encoder = new YamlEncoder();
            break;
        default:
            $encoder = null;
    }

    if ($encoder) {
        $outputText = $encoder->encode($inputText);
    }
}
?>
<!doctype html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Formularz – LAB F</title>
    <link rel="stylesheet" href="style-1.css">
</head>
<body>

<h2>Konwerter danych</h2>

<form method="post">
    <label>Format wejściowy:</label><br>
    <select name="inputOption">
        <option value="CSV" <?php if ($inputOption === 'CSV') echo 'selected'; ?>>CSV</option>
        <option value="SSV" <?php if ($inputOption === 'SSV') echo 'selected'; ?>>SSV</option>
        <option value="TSV" <?php if ($inputOption === 'TSV') echo 'selected'; ?>>TSV</option>
        <option value="JSON" <?php if ($inputOption === 'JSON') echo 'selected'; ?>>JSON</option>
        <option value="YAML" <?php if ($inputOption === 'YAML') echo 'selected'; ?>>YAML</option>
    </select>
    <br>
    <label>Dane wejściowe:</label><br>
    <textarea name="inputText" rows="10" cols="60"><?= htmlspecialchars($inputText) ?></textarea>
    <br>
    <label>Format wyjściowy:</label><br>
    <select name="outputOption">
        <option value="CSV" <?php if ($outputOption === 'CSV') echo 'selected'; ?>>CSV</option>
        <option value="SSV" <?php if ($outputOption === 'SSV') echo 'selected'; ?>>SSV</option>
        <option value="TSV" <?php if ($outputOption === 'TSV') echo 'selected'; ?>>TSV</option>
        <option value="JSON" <?php if ($outputOption === 'JSON') echo 'selected'; ?>>JSON</option>
        <option value="YAML" <?php if ($outputOption === 'YAML') echo 'selected'; ?>>YAML</option>
    </select>
    <br>
    <input type="submit" value="Wyślij">
</form>
<div class="outputText">
    <?php if ($outputText): ?>
        <pre><?= htmlspecialchars($outputText) ?></pre>
    <?php endif; ?>
</div>
</body>
</html>
