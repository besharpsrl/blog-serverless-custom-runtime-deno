export const environment = {
	production: false,
	name: "dev",
	account: "YOUR_AWS_ACCOUNT_ID",
	region: "eu-west-1",
	repository: {
		name: 'besharpsrl/blog-serverless-custom-runtime-deno',
		branch: 'develop',
		codeStarConnectionArn:
			'arn:aws:codestar-connections:eu-west-1:YOUR_AWS_ACCOUNT_ID:connection/CONNECTION_ARN',
		codeCommitArn: "arn:aws:codecommit:eu-west-1:YOUR_AWS_ACCOUNT_ID:besharp-blog-custom-runtime-deno",
	},
	...process.env,
};
