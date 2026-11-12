<?php

namespace App\Support;

class ArabicText
{
    public static function normalize(?string $value): string
    {
        $value = (string) $value;
        $value = preg_replace('/[\x{064B}-\x{0652}\x{0670}\x{0640}]/u', '', $value) ?? $value;
        $value = str_replace(['أ', 'إ', 'آ', 'ٱ'], 'ا', $value);
        $value = str_replace('ة', 'ه', $value);
        $value = str_replace('ى', 'ي', $value);

        return mb_strtolower($value, 'UTF-8');
    }

    public static function sql(string $column): string
    {
        $expr = $column;
        foreach ([
            'أ' => 'ا', 'إ' => 'ا', 'آ' => 'ا', 'ٱ' => 'ا',
            'ة' => 'ه', 'ى' => 'ي', 'ـ' => '',
        ] as $from => $to) {
            $expr = "REPLACE({$expr}, '{$from}', '{$to}')";
        }

        return $expr;
    }
}
