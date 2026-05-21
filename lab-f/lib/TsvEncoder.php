<?php
namespace App;

class TsvEncoder
{
    public function encode(string $text): string
    {
        $lines = explode("\n", trim($text));
        $out = '';

        foreach ($lines as $line) {

            // wykrywanie separatora na podstawie liczby wystąpień
            $counts = [
                "\t" => substr_count($line, "\t"),
                ";"  => substr_count($line, ";"),
                ","  => substr_count($line, ","),
                " "  => substr_count($line, " "),
            ];

            // wybieramy separator, który występuje najczęściej
            arsort($counts);
            $separator = array_key_first($counts);

            // jeśli separator to spacja, ale jest ich dużo → whitespace
            if ($separator === " ") {
                $parts = preg_split('/\s+/', trim($line));
            } else {
                $parts = explode($separator, $line);
            }

            // zamiana na TSV
            $out .= implode("\t", $parts) . "\n";
        }

        return $out;
    }
}
