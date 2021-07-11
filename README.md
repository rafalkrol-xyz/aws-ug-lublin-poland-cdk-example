# AWS User Group Lublin Poland CDK Example

## Overview

This repository holds the code that was presented by me during [the twelfth meetup of the AWS User Group Lublin (Poland)](https://www.youtube.com/watch?v=7mZRCm1dbFY&t=4600s).

## Prerequisites

* [an AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/) in which you can interact with the following services:
  * [VPC]
  * [EC2]
  * [ECS]
  * [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
  * [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)
  * [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
  * [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
* [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) that's properly [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
* [Docker](https://www.docker.com/)
* [Node v16 or higher](https://nodejs.org/en/)
  * the recommended way is to install it with [NVM](https://github.com/nvm-sh/nvm), e.g.:

  ```bash
  nvm install v16.1.0
  nvm use v16.1.0
  ```

* [CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

```bash
npm install -g aws-cdk
```

* [TypeScript](https://www.typescriptlang.org/)

```bash
npm install -g typescript
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm test`        perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emit the synthesized CloudFormation template
