#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { OneAzVpcStack } from '../lib/one-az-vpc-stack'
import { InstanceStack } from '../lib/instance-stack'
import { VpcEndpointServiceStack } from '../lib/vpc-endpoint-service-stack'

const app = new cdk.App()

const consumerVpc = new OneAzVpcStack(app, 'ConsumerVpc', {
  name: 'Consumer',
  cidr: '10.0.0.0/24',
})

const providerVpc = new OneAzVpcStack(app, 'ProviderVpc', {
  name: 'Provider',
  cidr: '10.0.1.0/24',
})

new InstanceStack(app, 'InstanceStack', {
  consumerVpc: consumerVpc.vpc,
  providerVpc: providerVpc.vpc,
})

new VpcEndpointServiceStack(app, 'VpcEndpointServiceStack', {
  providerVpc: providerVpc.vpc,
})
