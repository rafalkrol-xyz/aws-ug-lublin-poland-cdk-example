import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns'


interface InstanceStackProps extends cdk.StackProps {
  consumerVpc: ec2.Vpc,
  providerVpc: ec2.Vpc,
}

export class InstanceStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: InstanceStackProps) {
    super(scope, id, props)

    const allInbound = new ec2.SecurityGroup(this, 'AllInbound', {
      vpc: props.providerVpc,
    })
    allInbound.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTcp())

    const consumerInstance = new ec2.BastionHostLinux(this, 'ConsumerInstance', {
      vpc: props.consumerVpc,
      instanceName: 'ConsumerInstance'
    })

    // const providerInstance = new ec2.BastionHostLinux(this, 'ProviderInstance', {
    //   vpc: props.providerVpc,
    //   instanceName: 'ProviderInstance',
    //   securityGroup: allInbound,
    // })

    new ecsPatterns.NetworkLoadBalancedFargateService(this, 'Service', {
      vpc: props.providerVpc,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
    })

    new cdk.CfnOutput(this, 'ConsumerInstancePrivateIp', {
      value: consumerInstance.instancePrivateIp,
    })

    // new cdk.CfnOutput(this, 'ProviderInstancePrivateIp', {
    //   value: providerInstance.instancePrivateIp,
    // })

    // new cdk.CfnOutput(this, 'ProviderInstanceInstanceId', {
    //   value: providerInstance.instanceId,
    //   exportName: 'ProviderInstanceInstanceId'
    // })
  }
}
