import { Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApplicationProps } from "../bin/microservice_b";
import { MainStack } from "./mainStack";
import { CoolMicroservice } from "./coolMicroservice";

export class DevStage extends Stage {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    new MainStack(
      this,
      `main-stack-${props.env.name}-${props.env.region}`,
      props
    );

    new CoolMicroservice(this, `cool-stack-${props.env.name}-${props.env.region}`, props);
  }
}
