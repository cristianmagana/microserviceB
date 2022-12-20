import { Handler } from "aws-cdk-lib/aws-lambda";

export const postHandler: Handler = async (event: any) => {
    const body = event.body;
    console.log(body);
    return {
        statusCode: 200, 
        body: `I have a body: ${body}`
    };
};