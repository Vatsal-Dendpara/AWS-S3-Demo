# Node.js S3 Bucket File Upload Example
This is a simple Node.js application that demonstrates how to upload files to an S3 bucket in AWS.

## Prerequisites
Before you begin, you will need the following:
 - An AWS account with an S3 bucket created
 - Node.js installed on your machine
 - AWS SDK for JavaScript installed


# Creating an AWS Account
## To create an AWS account, follow these steps:

1. Go to the AWS homepage and click on the "Create an AWS Account" button.
2. Follow the instructions to create a new account. You will need to provide your email address, a password, and some basic information about yourself.
3. Once your account is created, you can log in to the AWS Management Console using your email address and password.
# Creating an IAM User
## To create an IAM user, follow these steps:

1. Log in to the AWS Management Console and navigate to the IAM service.
2. Click on "Users" in the left-hand menu and then click on the "Add user" button.
3. Enter a name for your user and select the "Programmatic access" option.
4. Choose the permissions that you want to give your user. For example, if you want your user to be able to upload files to an S3 bucket, you will need to give them the "AmazonS3FullAccess" permission.
5. Review your settings and click on the "Create user" button.
6. Make a note of the access key ID and secret access key that are generated for your user. You will need these to authenticate your user when uploading files to your S3 bucket.

# Creating an S3 Bucket
## To create an S3 bucket, follow these steps:

1. Log in to the AWS Management Console and navigate to the S3 service.
2. Click on the "Create bucket" button.
3. Enter a name for your bucket and choose a region.
4. Choose the settings that you want for your bucket. For example, you can choose to enable versioning or server access logging.
5. Review your settings and click on the "Create bucket" button.
# Setting Bucket Policies
## To set policies for your S3 bucket, follow these steps:

1. Log in to the AWS Management Console and navigate to the S3 service.
2. Click on the name of the bucket that you want to set policies for.
3. Click on the "Permissions" tab.
4. Click on the "Bucket Policy" button.
5. Enter the policy that you want to set in the text box. For example, you can set a policy that only allows certain IP addresses to access your bucket, or a policy that requires authentication to access your bucket.
6. Review your policy and click on the "Save" button.

That's a brief overview of how to create an AWS account, an IAM user, create an S3 bucket, and set policies for your S3 bucket. There are many more settings and configurations that you can choose from in AWS, so be sure to read the documentation carefully and choose the settings that are appropriate for your needs.

## Getting Started
To get started with this application, follow these steps:
1. Clone the repository to your local machine:
    ```
    git clone https://github.com/your-username/s3-file-upload-nodejs.git
    ```
2. Install the required packages:
    ```
    npm install
    ```
3. Create a .env file in the root directory of your project and add the following variables:
    ```
    PORT=3000
    AWS_DEFAULT_REGION = your-region-name
    S3_BUCKET_NAME = your-bucket-name
    AWS_APP_USER_ACCESS_KEY = your-access-key-id
    AWS_APP_USER_SECRET_ACCESS_KEY = your-secret-access-key
    ```
Replace **your-access-key-id**, **your-secret-access-key** ,**your-region-name**, and **your-bucket-name** with your own values.

5. Start the application:
    ```
    node app.js
    ```

## Uploading Files
To upload files to your S3 bucket, simply make a POST request to the **'/v1/files/add-file'** endpoint with the file you want to upload in the body of the request. The file should be sent as **'multipart/form-data'**.

For example, you can use a tool like **Postman** to upload a file:

- Add file to S3 example 

![Alt text](/screenshots/SS1.png?raw=true "Optional Title")

- Get file from S3 by filename

![Alt text](/screenshots/SS2.png?raw=true "Optional Title")

- Delete file from S3 by filename

![Alt text](/screenshots/SS3.png?raw=true "Optional Title")

- Upload a file to S3 using multipart and chunk by chunk (you can use this endpoint to upload large files)
- i have a refered this article to implement this endpoint 
    https://medium.com/@samuelhenshaw2020/multipart-upload-of-large-files-to-aws-s3-with-nodejs-2810b1a9f719

![Alt text](/screenshots/SS4.png?raw=true "Optional Title")

- to download a large files or zip file you can use this endpoint it will automatically creates zip file and streamed it to client without even creating zip file into the server.

![Alt text](/screenshots/SS5.png?raw=true "Optional Title")