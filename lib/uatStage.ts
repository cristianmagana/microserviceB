import { Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApplicationProps } from "../bin/microservice_b";
import { MainStack } from "./mainStack";

export class UatStage extends Stage {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    new MainStack(
      this,
      `main-stack-${props.env.name}-${props.env.region}`,
      props
    );
  }
}
