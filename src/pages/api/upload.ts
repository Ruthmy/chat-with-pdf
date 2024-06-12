import type { APIRoute } from "astro";

import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET
});

// Upload data stream to Cloudinary this way nothing is paralyzed with large files
const uploadStream = async (buffer: Uint8Array, options: {
  folder: string,
}): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary
      .uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      }).end(buffer);
  });
}

// POST /api/upload
export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData(); // JavaScript- Parse the incoming form data
  const file = formData.get('file') as File; // Get the file from the form data

  if (file == null) {
    return new Response("No file found", { status: 400 });
  }
  // Convert file to an array buffer
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const result = await uploadStream(uint8Array, {
    folder: 'pdf'
  });

  const {
    asset_id: id,
    secure_url: url,
    pages
  } = result;

  return new Response(JSON.stringify({
    id,
    url,
    pages
  }));
}
