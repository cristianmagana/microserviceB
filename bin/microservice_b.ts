#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MicroserviceBStack } from "../lib/microservice_b-stack";

const app = new cdk.App();

type AccountConfig = {
  name: string;
  account: string;
  region: string;
  branch?: string;
};

type EnvironmentConfig = {
  env: AccountConfig;
};

type CodeArtifactProps = {
  codeArtifactRepo: string;
  codeArtifactDomain: string;
};

type LoadTestingProp = {
  activateLambdaLoadTestings: boolean;
  loadTestName: string;
};

type PipelineAppProps = {
  name: string;
  ghRepository: string;
} & CodeArtifactProps &
  LoadTestingProp;

export type MicroServiceProps = { lambdaName: string } & EnvironmentConfig;

const projectName = "microserviceB";
const githubOwner = "cristianmagana";
const codeStarConnectionArn =
  "arn:aws:codestar-connections:us-east-1:964108025908:connection/813402cd-cb3d-405e-8fe3-b52a2a27c327";

const buildConfig = {
  env: {
    name: "build",
    account: "964108025908",
    region: "us-east-1",
  },
};

const loadTestingConfig: LoadTestingProp = {
  activateLambdaLoadTestings: true,
  loadTestName: "loadtest.yaml",
};
const environmentConfig: MicroServiceProps[] = [
  {
    env: {
      name: "dev",
      account: "574061284422",
      region: "us-east-1",
      branch: "master",
    },
    lambdaName: "microservice-B",
  },
  {
    env: {
      name: "dev",
      account: "574061284422",
      region: "us-west-2",
      branch: "master",
    },
    lambdaName: "microservice-B",
  },
  {
    env: {
      name: "uat",
      account: "871495003945",
      region: "us-east-1",
      branch: "master",
    },
    lambdaName: "microservice-B",
  },
  {
    env: {
      name: "uat",
      account: "871495003945",
      region: "us-west-2",
      branch: "master",
    },
    lambdaName: "microservice-B",
  },
  {
    env: {
      name: "prod",
      account: "248758679486",
      region: "us-east-1",
      branch: "master",
    },
    lambdaName: "microservice-B",
  },
  {
    env: {
      name: "prod",
      account: "248758679486",
      region: "us-west-2",
      branch: "master",
    },
    lambdaName: "microservice-B",
  },
];

const codeArtifactConfig: CodeArtifactProps = {
  codeArtifactDomain: "digitalxtian-com",
  codeArtifactRepo: "aws-cdk",
};

export type ApplicationProps = EnvironmentConfig &
  PipelineAppProps & {
    environments: MicroServiceProps[];
    codeStarConnectionArn: string;
  };

const applicationProps: ApplicationProps = {
  environments: environmentConfig,
  ghRepository: "cristianmagana/microserviceB",
  codeStarConnectionArn,
  name: projectName,
  ...codeArtifactConfig,
  ...loadTestingConfig,
  ...buildConfig,
};

new MicroserviceBStack(app, "MicroserviceBStack", applicationProps);
