<?php
namespace App;

class CsvEncoder
{
    public function encode(string $text): string
    {
        $lines = explode("\n", trim($text));
        $csv = [];

        foreach ($lines as $line) {
            $csv[] = str_getcsv($line);
        }

        $out = '';
        foreach ($csv as $row) {
            $out .= implode(",", $row) . "\n";
        }

        return $out;
    }
}
