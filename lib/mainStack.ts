import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApplicationProps } from "../bin/microservice_b";
import { Stack } from "aws-cdk-lib";
import { Queue } from "aws-cdk-lib/aws-sqs";

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    new Queue(this, "Queue");
  }
}
