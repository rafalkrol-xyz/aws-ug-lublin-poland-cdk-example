import { App } from '@aws-cdk/core'
import '@aws-cdk/assert/jest'
import * as ec2 from '@aws-cdk/aws-ec2'
import { VpcStack } from '../lib/vpc-stack'
import { ConsumerInstanceStack } from '../lib/consumer-instance-stack'
import { VpcEndpointServiceStack } from '../lib/vpc-endpoint-service-stack'

describe('A VpcStack', () => {
  const app = new App()
  const testVpcStack = new VpcStack(app, 'TestVpcStack', {
    name: 'Test',
    cidr: '10.0.0.0/24',
  })

  test('has one VPC', () => {
    expect(testVpcStack).toCountResources('AWS::EC2::VPC', 1)
  })

  test('has four subnets, each with a route table, a route table association and a default route', () => {
    expect(testVpcStack).toCountResources('AWS::EC2::Subnet', 4)
    expect(testVpcStack).toCountResources('AWS::EC2::RouteTable', 4)
    expect(testVpcStack).toCountResources('AWS::EC2::SubnetRouteTableAssociation', 4)
    expect(testVpcStack).toCountResources('AWS::EC2::Route', 4)
  })

  test('has an attached Internet Gateway', () => {
    expect(testVpcStack).toCountResources('AWS::EC2::InternetGateway', 1)
    expect(testVpcStack).toCountResources('AWS::EC2::VPCGatewayAttachment', 1)
  })

  test('has two NAT Gateways with elastic IPs assigned', () => {
    expect(testVpcStack).toCountResources('AWS::EC2::NatGateway', 2)
    expect(testVpcStack).toCountResources('AWS::EC2::EIP', 2)
  })

  test('has a property called vpc of type ec2.Vpc', () => {
    expect(testVpcStack).toHaveProperty('vpc')
    expect(testVpcStack.vpc).toBeInstanceOf(ec2.Vpc)
  })
})


describe('A ConsumerInstanceStack', () => {
  const app = new App()
  const testVpcStack = new VpcStack(app, 'TestVpcStack', {
    name: 'Test',
    cidr: '10.0.0.0/24',
  })
  const testConsumerInstanceStack = new ConsumerInstanceStack(app, 'TestConsumerInstanceStack', {
    consumerVpc: testVpcStack.vpc,
  })

  test('has 1 EC2 instance with a Security Group allowing all outbound access', () => {
    expect(testConsumerInstanceStack).toCountResources('AWS::EC2::Instance', 1)
    expect(testConsumerInstanceStack).toCountResources('AWS::EC2::SecurityGroup', 1)
    expect(testConsumerInstanceStack).toHaveResource('AWS::EC2::SecurityGroup', {
      'SecurityGroupEgress': [
        {
          'CidrIp': '0.0.0.0/0',
          'Description': 'Allow all outbound traffic by default',
          'IpProtocol': '-1',
        },
      ],
    })
  })
})


describe('A VpcEndpointServiceStack', () => {
  const app = new App()
  const testVpcStack1 = new VpcStack(app, 'TestVpcStack1', {
    name: 'Test1',
    cidr: '10.0.0.0/24',
  })
  const testVpcStack2 = new VpcStack(app, 'TestVpcStack2', {
    name: 'Test1',
    cidr: '10.0.1.0/24',
  })
  const testVpcEndpointServiceStack = new VpcEndpointServiceStack(app, 'TestVpcEndpointServiceStack', {
    providerVpc: testVpcStack1.vpc,
    consumerVpc: testVpcStack2.vpc,
  })

  test('has an internal Network Load Balancer', () => {
    expect(testVpcEndpointServiceStack).toCountResources('AWS::ElasticLoadBalancingV2::LoadBalancer', 1)
    expect(testVpcEndpointServiceStack).toHaveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      'Scheme': 'internal',
      'Type': 'network',
    })
  })

  test('has a Fargate service allowing TCP connections on port 80', () => {
    expect(testVpcEndpointServiceStack).toCountResources('AWS::ECS::Service', 1)
    expect(testVpcEndpointServiceStack).toHaveResource('AWS::ECS::Service', {
      'LaunchType': 'FARGATE',
    })
    expect(testVpcEndpointServiceStack).toHaveResource('AWS::EC2::SecurityGroup', {
      'SecurityGroupIngress': [
        {
          'CidrIp': '0.0.0.0/0',
          'Description': 'from 0.0.0.0/0:80',
          'FromPort': 80,
          'ToPort': 80,
          'IpProtocol': 'tcp',
        },
      ],
    })
  })

  test('has a VPC Endpoint Service that permits access from one AWS account', () => {
    expect(testVpcEndpointServiceStack).toCountResources('AWS::EC2::VPCEndpointService', 1)
    expect(testVpcEndpointServiceStack).toHaveResource('AWS::EC2::VPCEndpointServicePermissions', {
      'AllowedPrincipals': [
        `arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:root`,
      ],
    })
  })

  test('has a VPC Endpoint of type interface', () => {
    expect(testVpcEndpointServiceStack).toCountResources('AWS::EC2::VPCEndpoint', 1)
    expect(testVpcEndpointServiceStack).toHaveResource('AWS::EC2::VPCEndpoint', {
      'VpcEndpointType': 'Interface',
    })
  })
})
