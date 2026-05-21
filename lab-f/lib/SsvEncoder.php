<?php
namespace App;

class SsvEncoder
{
    public function encode(string $text): string
    {
        $lines = explode("\n", trim($text));
        $out = '';

        foreach ($lines as $line) {
            if (str_contains($line, ",")) {
                $parts = explode(",", $line);
            } elseif (str_contains($line, "\t")) {
                $parts = explode("\t", $line);
            } elseif (str_contains($line, ";")) {
                $parts = explode(";", $line);
            } else {
                $parts = preg_split('/\s+/', trim($line));
            }
            $out .= implode(";", $parts) . "\n";
        }

        return $out;
    }
}
