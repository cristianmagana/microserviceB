import { Construct } from "constructs";
import { createPipeline, createLoadTest } from "@digitalxtian/aws-cdk-pipeline";
import { ApplicationProps } from "../bin/microservice_b";
import { Stack } from "aws-cdk-lib";
import { DevStage } from "./devStage";
import { UatStage } from "./uatStage";
import { ProdStage } from "./prodStage";

export class MicroserviceBStack extends Stack {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    const { pipeline, devEnvironment, uatEnvironment, prodEnvironment } =
      createPipeline(this, "microserviceB-pipeline", {
        name: `${props.name}-pipeline`,
        ghRepository: "cristianmagana/microserviceB",
        codeArtifactDomain: props.codeArtifactDomain,
        codeArtifactRepo: props.codeArtifactRepo,
        loadTestName: "loadtest.yaml",
        activateLambdaLoadTestings: true,
        env: {
          name: props.env.name,
          account: props.env.account,
          region: props.env.region,
          branch: "master",
        },
      });

    const devEnvs = props.environments.filter(
      (environments) => environments.env.name === "dev"
    );
    for (const devEnv of devEnvs)
      devEnvironment.addStage(
        new DevStage(this, `dev-stage-${devEnv.env.region}`, { ...devEnv })
      );

    const loadTestBuild = createLoadTest(this, `${props.env.region}`, {
      loadTestName: "loadtest.yaml",
    });

    devEnvironment.addPost(loadTestBuild);

    const uatEnvs = props.environments.filter(
      (environments) => environments.env.name === "uat"
    );
    for (const uatEnv of uatEnvs)
      uatEnvironment.addStage(
        new UatStage(this, `uat-stage-${uatEnv.env.region}`, { ...uatEnv })
      );

    const prodEnvs = props.environments.filter(
      (environments) => environments.env.name === "prod"
    );
    for (const prodEnv of prodEnvs)
      prodEnvironment.addStage(
        new ProdStage(this, `prod-stage-${prodEnv.env.region}`, { ...prodEnv })
      );

    pipeline.buildPipeline();
  }
}
