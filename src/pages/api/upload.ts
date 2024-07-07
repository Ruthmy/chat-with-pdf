import type { APIRoute } from "astro";
import fs from 'node:fs/promises';
import path from 'node:path';

import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET
});

const outputDir = path.join(process.cwd(), 'public/text');

// Upload data stream to Cloudinary this way nothing is paralyzed with large files
const uploadStream = async (buffer: Uint8Array, options: {
  folder: string,
  ocr?: string,
}): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary
      .uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      }).end(buffer);
  }).catch((error) => {
    // show cloudinary error
    console.error('Error message:', error.message);
    throw new Error('Failed to upload file');
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

  // Upload the file to Cloudinary
  const result = await uploadStream(uint8Array, {
    folder: 'pdf',
    ocr: 'adv_ocr'
  });

  const {
    asset_id: id,
    secure_url: url,
    pages,
    info
  } = result;

  // Extract OCR data from the upload
  const data = info?.ocr?.adv_ocr?.data;

  // Extract the text from the OCR data
  const text = data.map((blocks: { textAnnotations: { description: string }[] }) => {
    const annotations = blocks['textAnnotations'] ?? {};
    const first = annotations[0] ?? {};
    const content = first['description'] ?? '';
    return content.trim();
  }).filter(Boolean).join('\n')

// TODO: Meter esta info en una base de datos
// Mejor todavía en un vector y hacer los embeddings

fs.writeFile(`${outputDir}/${id}.txt`, text, 'utf-8');

  return new Response(JSON.stringify({
    id,
    url,
    pages
  }));
}
