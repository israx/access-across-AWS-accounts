import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class DestinationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a basic S3 bucket
    const bucket = createBucket(this, 'demo-bucket-shared-container')

    // create policy
    const readWriteAppBucketPolicy = new iam.PolicyDocument({
      statements:[
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions:['s3:ListAllMyBuckets'],
          resources:['*']
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions:["s3:ListBucket", "s3:GetBucketLocation"],
          resources:[ bucket.bucketArn ] // Access the bucket's arn
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions:["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
          resources:[`${bucket.bucketArn}/*`]
        })
      ]
    })

   // create role and enabling a trust relationship between destination and originating account
   const accessRole = new iam.Role(this, 'S3AccessRole', {
    roleName:'UpdateData',
    assumedBy: new iam.AccountPrincipal(process.env.ORIGINATING_ACCOUNT_ID),
    description: 'Role with custom S3 access policy',
    inlinePolicies: {
     readWriteAppBucketPolicy
    },
  });

    // Add outputs to access bucket information
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket'
    });

    new cdk.CfnOutput(this, 'BucketArn', {
      value: bucket.bucketArn,
      description: 'The ARN of the S3 bucket'
    });

    new cdk.CfnOutput(this, 's3RoleARN', {
      value: accessRole.roleArn,
      description: 'The ARN of the IAM role'
    })
  }

}

function createBucket(construct: Construct, name:string): s3.Bucket {
  return new s3.Bucket(construct, name, {
    bucketName: name, 

    encryption: s3.BucketEncryption.S3_MANAGED, // Use S3-managed encryption

    versioned: true,

    publicReadAccess: false,

    enforceSSL: true,

    lifecycleRules: [
      {
        expiration: cdk.Duration.days(365), // Optionally expire objects after 1 year
        transitions: [
          {
            storageClass: s3.StorageClass.INFREQUENT_ACCESS,
            transitionAfter: cdk.Duration.days(30)
          }
        ]
      }
    ],
    removalPolicy: cdk.RemovalPolicy.DESTROY, 
    autoDeleteObjects: true
  });
}
