<?php
namespace App\Traits;

use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Log;

trait UploadsToCloudinary
{
    protected function uploadToCloudinary($file, string $folder): string
    {
        try {
            $cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => config('services.cloudinary.cloud_name'),
                    'api_key'    => config('services.cloudinary.api_key'),
                    'api_secret' => config('services.cloudinary.api_secret'),
                ],
            ]);

            $result = $cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                ['folder' => $folder]
            );

            return $result['secure_url'];

        } catch (\Exception $e) {
            Log::error('Cloudinary upload failed: ' . $e->getMessage());
            throw new \Exception('Image upload failed');
        }
    }
}
