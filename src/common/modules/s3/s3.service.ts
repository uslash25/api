import {
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { lookup } from 'mime-types';
import { LogService } from '../log';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class S3Service {
  private readonly bucket = process.env.AWS_S3_BUCKET_NAME || '';

  constructor(@Inject('S3_CLIENT') private readonly s3: S3Client,
    private readonly logger: LogService) {
  }

  async delete(key: string) {
    try {
      await this.s3.send(new DeleteObjectCommand({
        Bucket: this.bucket,
        Key:    key,
      }));
    } catch (err) {
      console.error('[s3Service] Delete Failed:', key, err);

      throw new InternalServerErrorException('Failed to delete from S3');
    }
  }

  async upload(key: string, buffer: Buffer) {
    try {
      await this.s3.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key:    key,
        Body:   buffer,
      }));
    } catch (err) {
      console.error('[s3Service] Upload Failed:', key, err);

      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  buildPublicUrl(path: string) {
    return `${this.s3.config.endpoint}/${path}`;
  }

  @CacheTTL(3600)
  async getPresignedUrlByKey(key: string, type: 'download' | 'view' = 'download') {
    const contentType = lookup(key.split('/').pop() || key) || 'application/octet-stream';

    const command = new GetObjectCommand({
      Bucket:                     this.bucket,
      Key:                        key,
      ResponseContentDisposition: type === 'download' ? 'attachment' : 'inline',
      ResponseContentType:        contentType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    return {
      filename: key.split('/').pop() || key,
      path:     key,
      url,
    };
  }

  @CacheTTL(600)
  async getUploadPresignedUrl(key: string) {
    const contentType = lookup(key) || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket:      this.bucket,
      Key:         key,
      ContentType: contentType,
    });

    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn: 600 });

      return {
        key,
        url,
        contentType,
      };
    } catch (err) {
      console.error('[s3Service] Get Upload Presigned URL Failed:', key, err);

      throw new InternalServerErrorException('Failed to get presigned URL for upload');
    }
  }

  async initiateMultipartUpload(key: string) {
    const command = new CreateMultipartUploadCommand({
      Bucket: this.bucket,
      Key:    key,
    });

    return this.s3.send(command);
  }

  async uploadPartial(key: string, uploadId: string, body: Buffer, partNumber: number) {
    const command = new UploadPartCommand({
      Bucket:     this.bucket,
      Key:        key,
      Body:       body,
      UploadId:   uploadId,
      PartNumber: partNumber,
    });

    return this.s3.send(command);
  }

  async completeMultipartUpload(key: string, uploadId: string, parts: CompletedPart[]) {
    const command = new CompleteMultipartUploadCommand({
      Bucket:          this.bucket,
      Key:             key,
      UploadId:        uploadId,
      MultipartUpload: { Parts: parts },
    });

    return this.s3.send(command);
  }

  async isFileExists(key: string): Promise<boolean> {
    try {
      await this.s3.send(new HeadObjectCommand({
        Bucket: this.bucket,
        Key:    key,
      }));

      return true;
    } catch (error) {
      if (error instanceof Error && 'name' in error && error.name === 'NotFound') {
        return false;
      }

      if (typeof error === 'object' && error !== null && '$metadata' in error) {
        const metadata = (error as {
          $metadata?: {
            httpStatusCode?: number;
          };
        }).$metadata;

        if (metadata?.httpStatusCode === 404) {
          return false;
        }
      }

      this.logger.error('[s3Service] Check File Exists Failed:', key);

      throw new InternalServerErrorException('Failed to check file existence in S3');
    }
  }
}
