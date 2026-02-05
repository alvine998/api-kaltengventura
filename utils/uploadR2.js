const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../config/r2");
require("dotenv").config();

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

const uploadFileToR2 = async (fileBuffer, fileName, contentType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
      // ACL: 'public-read', // R2 doesn't always support ACLs depending on bucket set up, usually public access is managed via bucket settings or public domains.
    });

    await r2.send(command);

    // Construct the public URL
    // Assuming R2_PUBLIC_DOMAIN is configured (e.g., https://pub-xxx.r2.dev or custom domain)
    // If not, you might need to use a presigned URL or just the default R2 domain
    const publicUrl = `${R2_PUBLIC_DOMAIN}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw error;
  }
};

module.exports = {
  uploadFileToR2,
};
