import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2'
import * as targets from '@aws-cdk/aws-elasticloadbalancingv2-targets'

interface VpcEndpointServiceStackProps extends cdk.StackProps {
  providerVpc: ec2.Vpc,
}

export class VpcEndpointServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: VpcEndpointServiceStackProps) {
    super(scope, id, props)

    const port = 80

    const nlb = new elbv2.NetworkLoadBalancer(this, 'NetworkLoadBalancer', {
      vpc: props.providerVpc,
    })

    const listener = nlb.addListener('Listener', {
      port,
    })

    listener.addTargets('Target', {
      port,
      targets: [new targets.InstanceIdTarget(cdk.Fn.importValue('ProviderInstanceInstanceId'))],
    })

    new ec2.VpcEndpointService(this, 'VpcEndpointService', {
      vpcEndpointServiceLoadBalancers: [nlb],
    })

    // new ec2.InterfaceVpcEndpointService('test',)
  }
}
