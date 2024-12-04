import { GetBucketLocationCommand, ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AssumeRoleCommand, STSClient } from "@aws-sdk/client-sts";
import * as dotenv from 'dotenv';

dotenv.config();

const stsClient = new STSClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY ?? '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY ?? ''
    },
});

const getCredentials = async () => {
    const output = await stsClient.send(
        new AssumeRoleCommand({
            RoleArn: `arn:aws:iam::${process.env.DESTINATION_ACCOUNT_ID}:role/UpdateData`,
            RoleSessionName: `iamBasicScenarioSession-${Math.floor(
                Math.random() * 1000000,
            )}`,
            DurationSeconds: 900,
        }),
    )
    return output.Credentials;
}

const listBuckets = async (s3Client: S3Client) => {

    const { Buckets } = await s3Client.send(new ListBucketsCommand({}));

    return Buckets
}

const bucketLocation = async (s3Client: S3Client, name: string) => {
    const response = await s3Client.send(new GetBucketLocationCommand({ Bucket: name }));
    return response;
}

(async function () {
    const credentials = await getCredentials();

    if (!credentials) throw new Error('no credentials were found');
    
    const s3Client = new S3Client({
        credentials: {
            accessKeyId: credentials.AccessKeyId ?? '',
            secretAccessKey: credentials.SecretAccessKey ?? '',
            sessionToken: credentials.SessionToken
        }
    });

    const buckets = await listBuckets(s3Client);
    const promises = buckets?.map(bucket => new Promise(async (resolve, reject) => {
        try {
            const location = await bucketLocation(s3Client, bucket.Name ?? '')
            resolve({ name: bucket.Name, location })
        } catch (error) {
            reject(error)
        }
    })) ?? []

    const result = await Promise.allSettled(promises);
    console.log(result)

})()

