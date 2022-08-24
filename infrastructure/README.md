# Welcome to your CDK TypeScript project with a custom Deno Runtime

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Short description 

The project is composed in CDK and provides an API Gateway and a Lambda connected.

The lambda uses a Custom Runtime of Deno pulled directly from a cdn in the AWS Serverless Application Repository

The application code is just an hello world as this is a demo.

Given that we're using Deno in this project there's no need for a package manager because all the dependencies are resolved via URLs

# Scaffholding

lib -> two different cdk stack, one for the pipeline and the other one for the resources 
app -> source code for the lambda handler
environments -> env variables for dev and prod
