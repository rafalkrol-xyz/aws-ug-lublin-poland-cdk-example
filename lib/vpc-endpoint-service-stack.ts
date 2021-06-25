import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns'

interface VpcEndpointServiceStackProps extends cdk.StackProps {
  providerVpc: ec2.Vpc,
}

export class VpcEndpointServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: VpcEndpointServiceStackProps) {
    super(scope, id, props)

    const exampleFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(this, 'ExampleFargateService', {
      vpc: props.providerVpc,
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample') },
      publicLoadBalancer: true,
    })

    exampleFargateService.service.connections.allowFromAnyIpv4(ec2.Port.tcp(80))

    new ec2.VpcEndpointService(this, 'VpcEndpointService', {
      vpcEndpointServiceLoadBalancers: [exampleFargateService.loadBalancer],
    })

    // new ec2.InterfaceVpcEndpointService('test',)
  }
}
