#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {PipelineStack} from '../lib/pipeline.stack';
import {environment} from '../environments/environment';

const app = new cdk.App();
new PipelineStack(app, `BeSharpBlogCRDenoPipelineStack`, {
    stackName: `bersharp-bloc-cr-deno-pipeline-stack`,
    description: `${environment.name}`,
    terminationProtection: true,
    env: {
        account: environment.account,
        region: environment.region,
    },
    tags: {
        Environment: environment.name,
    },
    envName: environment.name,
});

