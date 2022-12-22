import { Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApplicationProps, MicroServiceProps } from '../bin/microservice_b';
import { MainStack } from "./mainStack";
export class DevStage extends Stage {
  constructor(scope: Construct, id: string, props: MicroServiceProps) {
    super(scope, id, props);

    new MainStack(
      this,
      `main-stack-${props.env.name}-${props.env.region}`,
      props
    );
    
  }
}
