<?php // I:\Webowka\lab-f\yaml.php

$data = [
    'name' => 'Bartosz Dobrochowski',
    'index' => '57773',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;