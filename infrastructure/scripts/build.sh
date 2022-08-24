#!/bin/bash
cd "$CODEBUILD_SRC_DIR"/infrastructure
npm install
npm run build
echo $ENVIRONMENT_NAME
npx cdk synth
