<?php

declare(strict_types=1);

namespace App\Helpers;

trait StringHelper {

    public function merchRef($name) 
    {
        $words = explode(" ", $name);
        $acronym = "";

        foreach ($words as $w) {
            $acronym .= strtoupper(mb_substr($w, 0, 1));
        }
        return $acronym;
    }
} 