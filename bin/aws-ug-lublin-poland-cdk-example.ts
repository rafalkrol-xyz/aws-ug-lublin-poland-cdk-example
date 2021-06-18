#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsUgLublinPolandCdkExampleStack } from '../lib/aws-ug-lublin-poland-cdk-example-stack';

const app = new cdk.App();
new AwsUgLublinPolandCdkExampleStack(app, 'AwsUgLublinPolandCdkExampleStack');
