#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { OriginatingStack } from '../lib/originating-stack';

dotenv.config();

const app = new cdk.App();

new OriginatingStack(app, 'OriginatingAccountStack', {
  env: { account: process.env.ORIGINATING_ACCOUNT_ID, region: 'us-east-1' },
});
