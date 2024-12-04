#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { DestinationStack } from '../lib/destination-stack';

dotenv.config();

const app = new cdk.App();

new DestinationStack(app, 'OriginatingAccountStack', {
  env: { account: process.env.DESTINATION_ACCOUNT_ID, region: 'us-east-1' },
});
