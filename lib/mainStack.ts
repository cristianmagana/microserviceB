import { Construct } from "constructs";
import { ApplicationProps, MicroServiceProps } from '../bin/microservice_b';
import { Stack } from "aws-cdk-lib";
import { ApiGatewayFullProps, createApiGateway, createNodeJsLambda } from "@digitalxtian/aws-cdk-pipeline";

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props: MicroServiceProps) {
    super(scope, id, props);

    const getLambda = createNodeJsLambda(this, `${id}-get-lambda-${props.env.region}`, 
      'lambda/coolMicroservice/src/getHandler/index.ts', 
      {
        functionName: 'getLambda',
        handler: 'getHandler',

      });

      const postLambda = createNodeJsLambda(this,`${id}-post-lambda-${props.env.region}`, 
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
