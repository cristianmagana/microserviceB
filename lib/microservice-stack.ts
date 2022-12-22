import { Construct } from "constructs";
import { createPipeline, createLoadTest } from "@digitalxtian/aws-cdk-pipeline";
import { ApplicationProps } from "../bin/microservice_b";
import { Stack } from "aws-cdk-lib";
import { DevStage } from "./devStage";
import { UatStage } from "./uatStage";
import { ProdStage } from "./prodStage";
import { BuildSpec, ComputeType, LinuxBuildImage, ReportGroup } from "aws-cdk-lib/aws-codebuild";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CodeBuildStep } from "aws-cdk-lib/pipelines";

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

      const loadTestReportGroup = new ReportGroup(this, `${id}-report-group`, {});

      const loadTestBuild = new CodeBuildStep(`${id}-load-testing-step`, {
          installCommands: ['npm install -g artillery@latest'],
          commands: [
              'pwd',
              'ls -la',
              `artillery run test/${props.loadTestName} -o test/load-test-${process.env.CODEBUILD_BUILD_NUMBER}.json`,
              'cd test',
              'ls -la',
          ],
          rolePolicyStatements: [
              new PolicyStatement({
                  actions: ['sts:AssumeRole'],
                  resources: ['*'],
                  conditions: {
                      StringEquals: {
                          'iam:ResourceTag/aws-cdk:bootstrap-role': 'lookup',
                      },
                  },
              }),
              new PolicyStatement({
                  effect: Effect.ALLOW,
                  actions: [
                      'codebuild:CreateReportGroup',
                      'codebuild:CreateReport',
                      'codebuild:UpdateReport',
                      'codebuild:BatchPutTestCases',
                      'codebuild:BatchPutCodeCoverages',
                  ],
                  resources: ['*'],
              }),
              new PolicyStatement({
                  effect: Effect.ALLOW,
                  actions: ['sts:GetServiceBearerToken'],
                  resources: ['*'],
              }),
          ],
          buildEnvironment: {
              computeType: ComputeType.SMALL,
              buildImage: LinuxBuildImage.STANDARD_6_0,
              privileged: true,
          },
          primaryOutputDirectory: 'cdk.out',
          partialBuildSpec: BuildSpec.fromObject({
              version: '0.2',
              reports: {
                  [loadTestReportGroup.reportGroupArn]: {
                      files: ['**/*'],
                      'base-directory': 'test',
                  },
              },
          }),
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
