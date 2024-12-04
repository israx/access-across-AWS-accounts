# Delegate access across AWS accounts using IAM roles 

This demo implements the [Delegate access across AWS accounts using IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html) workshop using CDK.

### Destination account setup:

1. install packages and setup env: `cd infra/destination && npm install && npm run setup-env`.
2. go to the generated .env file and modify it with your aws account ids
3. build the destination app: `npm run build` 
4. bootstrap your aws account: `cdk bootstrap --profile destination` — This assumes you have setup an AWS profile called `destination`
5. deploy the app: `cdk deploy`


### Originating account setup:

1. install packages and setup env: `cd infra/originating && npm install && npm run setup-env`.
2. go to the generated .env file and modify it with your aws account ids
3. build the destination app: `npm run build`
4. bootstrap your aws account: `cdk bootstrap --profile originating` — This assumes you have setup an AWS profile called `originating`
5. deploy the app: `cdk deploy`

### Assume role app setup:

After deploying AWS resources to account 1 and 2, we are ready to test them.

1. Login into the `originating` account console, and create access keys for the `developer` and `analyst` users created on the `originating` account. 
2. Go to the `assume-role-app` folder.
3. Go to the `package.json` file.
4. Go to `"scripts"` and modify the `analyst` script with the keys created for the `analyst` user.
5. Go to `"scripts"` and modify the `developer` script with the keys created for the `developer` user.
6. run `npm install`
7. run `npm run analyst` and see the output generated via the terminal.
8. run `npm run developer` and see the output generated via the terminal