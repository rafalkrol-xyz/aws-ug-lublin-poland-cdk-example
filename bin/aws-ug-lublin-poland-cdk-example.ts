#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { VpcStack } from '../lib/vpc-stack'
import { ConsumerInstanceStack } from '../lib/consumer-instance-stack'
import { VpcEndpointServiceStack } from '../lib/vpc-endpoint-service-stack'

const app = new cdk.App()

const consumerVpc = new VpcStack(app, 'ConsumerVpc', {
  cidr: '10.0.0.0/24',
  name: 'Consumer',
})

const providerVpc = new VpcStack(app, 'ProviderVpc', {
  cidr: '10.0.1.0/24',
  name: 'Provider',
})

new ConsumerInstanceStack(app, 'ConsumerInstanceStack', {
  consumerVpc: consumerVpc.vpc,
})

new VpcEndpointServiceStack(app, 'VpcEndpointServiceStack', {
  providerVpc: providerVpc.vpc,
  consumerVpc: consumerVpc.vpc,
})
