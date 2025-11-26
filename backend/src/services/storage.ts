import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET = process.env.S3_BUCKET || 'ValidIdea';

export async function uploadFile(
  file: Express.Multer.File,
  folder: string = 'uploads'
): Promise<string> {
  const key = `${folder}/${Date.now()}-${file.originalname}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  // Return the key (path) - in production, you'd return a full URL
  return key;
}

export async function getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

// Initialize bucket if it doesn't exist (for MinIO)
export async function ensureBucketExists(): Promise<void> {
  // This would typically be done via MinIO admin API or during setup
  // For now, we'll assume the bucket exists or is created manually
}

