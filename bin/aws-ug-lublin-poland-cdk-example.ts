#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { VpcStack } from '../lib/vpc-stack'
import { ConsumerInstanceStack } from '../lib/consumer-instance-stack'
import { VpcEndpointServiceStack } from '../lib/vpc-endpoint-service-stack'

const app = new cdk.App()

const cidr = '10.0.0.0/24'

const consumerVpc = new VpcStack(app, 'ConsumerVpc', {
  cidr,
  name: 'Consumer',
})

const providerVpc = new VpcStack(app, 'ProviderVpc', {
  cidr,
  name: 'Provider',
})

new ConsumerInstanceStack(app, 'ConsumerInstanceStack', {
  consumerVpc: consumerVpc.vpc,
})

new VpcEndpointServiceStack(app, 'VpcEndpointServiceStack', {
  providerVpc: providerVpc.vpc,
  consumerVpc: consumerVpc.vpc,
})
