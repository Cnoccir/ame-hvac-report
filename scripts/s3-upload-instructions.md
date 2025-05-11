# S3 Upload Instructions

This document provides step-by-step instructions for uploading the required files to an Amazon S3 bucket.

## Prerequisites

1. An AWS account with access to S3
2. AWS CLI installed and configured (or use the AWS Management Console)
3. The required files organized as described in the README.md

## Option 1: Using AWS Management Console

### Step 1: Create the S3 Bucket

1. Log in to the AWS Management Console
2. Navigate to S3
3. Click "Create bucket"
4. Enter a name for your bucket (e.g., "ame-techassist-bucket")
5. Choose a region close to your users
6. Configure options as needed (versioning, encryption, etc.)
7. Set permissions for public access as required
8. Click "Create bucket"

### Step 2: Create Folder Structure

1. Open your new bucket
2. Click "Create folder" and create the following folders:
   - ame-report-images
   - service-reports
   - documentation

### Step 3: Upload Files

#### For ame-report-images:
1. Click on the "ame-report-images" folder
2. Click "Upload"
3. Drag and drop all school images, logo, and favicon
4. Click "Upload"
5. Select all uploaded files
6. Click "Actions" → "Make public"

#### For service-reports:
1. Click on the "service-reports" folder
2. Click "Upload"
3. Drag and drop all PDF service reports
4. Click "Upload"
5. Select all uploaded files
6. Click "Actions" → "Make public"

#### For documentation:
1. Click on the "documentation" folder
2. Click "Upload"
3. Drag and drop all documentation PDF files
4. Click "Upload"
5. Select all uploaded files
6. Click "Actions" → "Make public"

## Option 2: Using AWS CLI

### Step 1: Create the S3 Bucket

```bash
aws s3api create-bucket --bucket ame-techassist-bucket --region us-east-1
```

### Step 2: Upload Files with Public Read Access

#### Upload Images:
```bash
# From the root directory of your project
cd placeholders/ame-report-images
aws s3 sync . s3://ame-techassist-bucket/ame-report-images/ --acl public-read
```

#### Upload Service Reports:
```bash
# From the root directory of your project
cd placeholders/service-reports
aws s3 sync . s3://ame-techassist-bucket/service-reports/ --acl public-read
```

#### Upload Documentation:
```bash
# From the root directory of your project
cd placeholders/documentation
aws s3 sync . s3://ame-techassist-bucket/documentation/ --acl public-read
```

## Verifying Uploads

To verify that all files have been uploaded correctly and are publicly accessible:

1. In the AWS Management Console, go to your S3 bucket
2. Click on any file
3. Look for the "Object URL" in the properties
4. Copy and paste this URL into a web browser
5. The file should load correctly

## Updating Application Configuration

After uploading all files, you need to ensure the application's configuration points to the correct location:

1. Open `utils/linkConfig.js`
2. Update the `BASE_URLS` object to point to your S3 bucket:

```javascript
const BASE_URLS = {
  IMAGES: 'https://your-bucket-name.s3.amazonaws.com/ame-report-images',
  REPORTS: 'https://your-bucket-name.s3.amazonaws.com/service-reports',
  DOCS: 'https://your-bucket-name.s3.amazonaws.com/documentation'
};
```

## Troubleshooting

### Files Not Publicly Accessible
If files are not accessible via the Object URL:
1. Select the files in the S3 console
2. Click "Actions" → "Make public"
3. If that doesn't work, check your bucket permissions and policy

### Wrong Content Type
If files don't display correctly in the browser:
1. Select the file in the S3 console
2. Click "Properties"
3. Under "Metadata", ensure the Content-Type is correct:
   - PNG files: image/png
   - PDF files: application/pdf
   - ICO files: image/x-icon
