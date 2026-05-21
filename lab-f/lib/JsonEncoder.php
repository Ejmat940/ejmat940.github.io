<?php
namespace App;

class JsonEncoder
{
    public function encode(string $text): string
    {
        $lines = explode("\n", trim($text));
        return json_encode($lines, JSON_PRETTY_PRINT);
    }
}
