<?php
namespace App;

class YamlEncoder
{
    public function encode(string $text): string
    {
        $lines = explode("\n", trim($text));
        $yaml = "";

        foreach ($lines as $line) {
            $yaml .= "- " . $line . "\n";
        }

        return $yaml;
    }
}
