import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApplicationProps } from "../bin/microservice_b";
import { Stack } from "aws-cdk-lib";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { ApiGatewayFullProps, createApiGateway, createNodeJsLambda } from "@digitalxtian/aws-cdk-pipeline";

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    const getLambda = createNodeJsLambda(this, `${id}-get-lambda`, 
      'lambda/coolMicroservice/src/getHandler/index.ts', 
      {
        functionName: 'getLambda',
        handler: 'getHandler',

      });

      const postLambda = createNodeJsLambda(this,`${id}-post-lambda`, 
      'lambda/coolMicroservice/src/postHandler/index.ts', {
        functionName: 'postLambda',
        handler: 'postHandler',
      });

      const gatewayProps: ApiGatewayFullProps = {
        resources: [
          {
            resourceName: 'coolResource',
            methodGet: {
              lambda: getLambda
            },
            methodPost: {
              lambda: postLambda
            },
          }
        ]
      }

      createApiGateway(this, `${id}-apigw`, gatewayProps);
  }
}
