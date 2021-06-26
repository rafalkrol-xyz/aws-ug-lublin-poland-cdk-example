import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns'
import * as iam from '@aws-cdk/aws-iam'

interface VpcEndpointServiceStackProps extends cdk.StackProps {
  providerVpc: ec2.Vpc,
  consumerVpc: ec2.Vpc,
}

export class VpcEndpointServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: VpcEndpointServiceStackProps) {
    super(scope, id, props)

    const exampleFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(this, 'ExampleFargateService', {
      vpc: props.providerVpc,
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample') },
      publicLoadBalancer: false,
      listenerPort: 443,
    })

    exampleFargateService.service.connections.allowFromAnyIpv4(ec2.Port.tcp(80))

    const vpcEndpointService = new ec2.VpcEndpointService(this, 'VpcEndpointService', {
      vpcEndpointServiceLoadBalancers: [exampleFargateService.loadBalancer],
      allowedPrincipals: [new iam.ArnPrincipal(`arn:aws:iam::${process.env.CDK_DEFAULT_ACCOUNT}:root`)],
      acceptanceRequired: false,
    })

    new ec2.InterfaceVpcEndpoint(this, 'InterfaceVpcEndpoint', {
      vpc: props.consumerVpc,
      service: new ec2.InterfaceVpcEndpointService(vpcEndpointService.vpcEndpointServiceName),
    })
  }
}
