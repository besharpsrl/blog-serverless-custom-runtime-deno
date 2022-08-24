import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
	CodeBuildStep,
	CodePipeline,
	CodePipelineSource,
} from "aws-cdk-lib/pipelines";
import { environment } from "../environments/environment";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import {InfrastructureStage} from './infrastructure-stack';

export class PipelineStack extends Stack {
	private readonly envName: string;
	private pipeline: CodePipeline;

	constructor(scope: Construct, id: string, props: PipelineProps) {
		super(scope, id, props);
		this.envName = props.envName;

		this.pipeline = new CodePipeline(this, "Pipeline", {
			pipelineName: `besharp-blog-custom-runtime-deno-pipeline`,
			dockerEnabledForSynth: true,
			publishAssetsInParallel: false,
			selfMutationCodeBuildDefaults: {
				buildEnvironment: {
					environmentVariables: {
						ENVIRONMENT_NAME: { value: this.envName }
					},
				},
			},
			// How it will be built and synthesized
			synth: new CodeBuildStep("Synth", {
				projectName: `besharp-blog-custom-runtime-deno-synth`,
				rolePolicyStatements: [
					PolicyStatement.fromJson({
						Action: ["ec2:*"],
						Resource: "*",
						Effect: "Allow",
					})
				],
				primaryOutputDirectory: "infrastructure/cdk.out",
				// Where the source can be found - Github with AWS connection
				// input: CodePipelineSource.connection(
				// 	environment.repository.name, environment.repository.branch, {
				// 		connectionArn: environment.repository.codeStarConnectionArn
				// }),
				// Use this part for CodeCommit integration
				input: CodePipelineSource.codeCommit(
					Repository.fromRepositoryArn(
						this,
						"Repository",
						environment.repository.codeCommitArn
					),
					environment.repository.branch
				),
				partialBuildSpec: codebuild.BuildSpec.fromObject({
					install: {
						"runtime-versions": {
							nodejs: 14,
						},
					},
				}),
				installCommands: [
					"bash $CODEBUILD_SRC_DIR/infrastructure/scripts/install.sh",
				],
				// Install dependencies, build and run cdk synth
				commands: [
					"bash $CODEBUILD_SRC_DIR/infrastructure/scripts/build.sh",
				],
				env: {
					ENVIRONMENT_NAME: this.envName,
				},
			}),
		});

		switch (this.envName) {
			case "dev":
				this.createDevelopmentResources();
				break;
		}
	}

	private createDevelopmentResources(): void {
		this.pipeline.addStage(
			new InfrastructureStage(this, "DevInfrastructureStage", {
				env: {
					account: environment.account,
					region: environment.region,
				},
			})
		);
	}
}

interface PipelineProps extends StackProps {
	envName: string;
}
