import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2'; // <--- this module is not available from the start; remember to import it: `npm install @aws-cdk/aws-ec2`

interface OneAzVpcStackProps extends cdk.StackProps {
  name: string,
  cidr: string,
}

export class OneAzVpcStack extends cdk.Stack {

  readonly vpc: ec2.Vpc

  constructor(scope: cdk.Construct, id: string, props: OneAzVpcStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, `Vpc${props.name}`, {
      maxAzs: 1,
      cidr: props.cidr,
    })

    this.vpc = vpc
  }
}
