import { Handler } from "aws-cdk-lib/aws-lambda";

export const getHandler: Handler = async (event: any, context: any) => {
    console.log(event);
    console.log(context);
    return {
        statusCode: 200, 
        body: 'GET Successful'
    };

};