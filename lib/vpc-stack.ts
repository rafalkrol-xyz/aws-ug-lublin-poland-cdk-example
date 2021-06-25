import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'

interface VpcStackProps extends cdk.StackProps {
  name: string,
  cidr: string,
}

export class VpcStack extends cdk.Stack {

  readonly vpc: ec2.Vpc

  constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
    super(scope, id, props)

    const vpc = new ec2.Vpc(this, `Vpc${props.name}`, {
      cidr: props.cidr,
    })

    this.vpc = vpc
  }
}
