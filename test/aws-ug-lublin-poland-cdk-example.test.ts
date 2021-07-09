import { App } from '@aws-cdk/core'
import '@aws-cdk/assert/jest'
import * as ec2 from '@aws-cdk/aws-ec2'
import { VpcStack } from '../lib/vpc-stack'
import { ConsumerInstanceStack } from '../lib/consumer-instance-stack'

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


test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AwsUgLublinPolandCdkExample.AwsUgLublinPolandCdkExampleStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
