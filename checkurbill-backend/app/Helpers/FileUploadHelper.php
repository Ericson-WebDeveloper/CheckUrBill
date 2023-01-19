<?php

declare(strict_types=1);

namespace App\Helpers;

use Illuminate\Http\File;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait FileUploadHelper
{

    public function makeFolder(string $path = "", string $folder = ""): bool
    {
        try {
            if (!$this->checkIfFolderExist($path, $folder)) {
                Storage::makeDirectory("{$path}/{$folder}");
                if ($this->checkIfFolderExist($path, $folder)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getFile(string $path = ""): bool | array | JsonResponse
    {
        try {
            $newpath = explode("/", $path);
            if($this->checkIfFileExist($newpath[0], $newpath[1], $newpath[2])) {
                return file(storage_path("app/public/".$path));
                // Storage::get($path); 
            } else {
                return response()->json(['message' => 'File Not Found'], 400);
                die();
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'File Not Found'], 500);
            die();
        }
    }

    public function checkIfFolderExist(string $path = "", string $folder = ""): bool
    {
        try {
            $directories = Storage::directories("{$path}");
            return in_array("{$path}/{$folder}", $directories) ? true : false;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function checkIfFileExist(string $path = "", string $folder = "", string $filename = ""): bool
    {
        try {
            return Storage::exists("{$path}/{$folder}/{$filename}") ? true : false;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function storeFile(string $path = "", string $folder = "", string $filename = "", $file): bool | string
    {
        try {
            // bills/ER-20221130093357/HAHAHAFILE.txt/Pq05TADyVpKoWifSyRZ7Rw3a13MxPfdIpp6bHl5P.csv
            // return Storage::disk('local')->put("uploaded/bills/merchant-1/{$filename}", $myfile);
            // Storage::disk('local')->put("{$path}/{$folder}/{$filename}", $file);
            $link_url = Storage::put("{$path}/{$folder}", $file);
            if ($link_url) {
                // if ($this->checkIfFileExist($path, $folder, $filename)) {
                return $link_url;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            // Log::error($e->getMessage());
            return false;
        }
    }

    public function deleteFile(string $path = "", string $folder = "", string $filename = "", $file): bool
    {
        try {
            if ($this->checkIfFileExist($path, $folder, $filename)) {
                Storage::delete("{$path}/{$folder}/{$filename}");
                if ($this->checkIfFileExist($path, $folder, $filename)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }


    public function createPutHeadersCsv(string $path, string $filename, array $headers) 
    {
        $file = fopen($path.$filename, 'w');
            // $headers = array('Account No','Transaction Type','Name','Address','Email','Bill From','Bill To','Due Date','Reference No','Status',
            // 'Amount Payment','Amount');
        fputcsv($file, $headers);
        fclose($file);
    }

}
