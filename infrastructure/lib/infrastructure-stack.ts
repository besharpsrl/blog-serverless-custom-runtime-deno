import * as cdk from 'aws-cdk-lib';
import {Duration, Stage, StageProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import {CfnApplication} from 'aws-cdk-lib/aws-sam';
import {LambdaRestApi} from 'aws-cdk-lib/aws-apigateway';

export class InfrastructureStage extends Stage {
  constructor(scope: Construct, id: string, props: InfrastructureStageProps) {
    super(scope, id, props);

    new InfrastructureStack(this, "InfrastructureStack", {
      stackName: `besharp-blog-cr-deno-infrastructure-stack`,
      description: `Besharp blog CR Deno Stack`,
      terminationProtection: true,
      tags: {
        Environment: 'Besharp Blog'
      }
    });
  }
}

export interface InfrastructureStageProps extends StageProps {
  env: {
    account: string,
    region: string,
  },
}

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const denoRuntime = new CfnApplication(this, "DenoRuntime", {
      location: {
        applicationId:
            "arn:aws:serverlessrepo:us-east-1:390065572566:applications/deno",
        semanticVersion: "1.24.3",
      },
    });

    // Deno Layer
    const layer = lambda.LayerVersion.fromLayerVersionArn(
        this,
        "denoRuntimeLayer",
        denoRuntime.getAtt("Outputs.LayerArn").toString(),
    );

    const lambdaFunction = new lambda.Function(this, `DenoLambda`, {
      functionName: 'besharp-blog-custom-runtime-deno-cdk',
      code: lambda.Code.fromAsset("../app"),
      handler: "hello.handler",
      layers: [layer],
      runtime: lambda.Runtime.PROVIDED_AL2,
      memorySize: 128,
      timeout: Duration.seconds(30),
    });

    // API Gateway
    new LambdaRestApi(this, "ApiGateway", {
      handler: lambdaFunction,
      restApiName: 'besharp-blog-deno-custom-runtime'
    });
  }
}
