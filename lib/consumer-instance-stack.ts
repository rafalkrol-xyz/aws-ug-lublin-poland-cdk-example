import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'

interface ConsumerInstanceStackProps extends cdk.StackProps {
  consumerVpc: ec2.Vpc,
}

export class ConsumerInstanceStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: ConsumerInstanceStackProps) {
    super(scope, id, props)

    new ec2.BastionHostLinux(this, 'ConsumerInstance', {
      vpc: props.consumerVpc,
      instanceName: 'ConsumerInstance',
    })
  }
}
