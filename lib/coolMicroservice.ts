import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApplicationProps } from "../bin/microservice_b";
import { ApiGatewayFullProps, createNodeJsLambda } from '@digitalxtian/aws-cdk-pipeline';
import { createApiGateway } from "@digitalxtian/aws-cdk-pipeline";

export class CoolMicroservice extends Stack {
    constructor(scope: Construct, id: string, props: ApplicationProps) {
      super(scope, id, props);
  
      const getLambda = createNodeJsLambda(this, `${id}-get-lambda`, 
      'lambda/coolMicroservice/src/getHandler', 
      {
        functionName: 'getLambda',
        handler: 'getHandler',

      });

      const postLambda = createNodeJsLambda(this,`${id}-post-lambda`, 
      'lambda/coolMicroservice/src/getHandler', {
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