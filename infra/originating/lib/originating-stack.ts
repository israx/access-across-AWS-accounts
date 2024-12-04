import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class OriginatingStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create first IAM user
        const developerUser = new iam.User(this, 'User1', {
            userName: 'developer',
            password: cdk.SecretValue.unsafePlainText('Welcome1234!'),
            passwordResetRequired: true,
        });

        // Create second IAM user
        const analystUser = new iam.User(this, 'User2', {
            userName: 'analyst',
            password: cdk.SecretValue.unsafePlainText('Welcome1234!'),
            passwordResetRequired: true
        });
        
        // Create policy statements
        
        // Role was created on the destination cdk stack
        const updateDataRoleArn= `arn:aws:iam::${process.env.DESTINATION_ACCOUNT_ID}:role/UpdateData`; 
        const allowAssumeRolePolicyDocument = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['sts:AssumeRole'],
            resources: [updateDataRoleArn]
        })
        const denyAssumeRolePolicyDocument = new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            actions: ['sts:AssumeRole'],
            resources: [updateDataRoleArn]
        })

        // Attach policies for specific access
        developerUser.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
        developerUser.addToPolicy(allowAssumeRolePolicyDocument);
        developerUser.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
        analystUser.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess'));
        analystUser.addToPolicy(denyAssumeRolePolicyDocument);
        analystUser.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
}
