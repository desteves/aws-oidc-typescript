import * as pulumi from "@pulumi/pulumi";
import { LocalWorkspace } from '@pulumi/pulumi/automation';
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const organization = pulumi.getOrganization();
const stackRefName: string = config.require("stackRefName");

// Uses the OIDC Stack reference to retrieve the output of the ESC Environment
const stackRef = new pulumi.StackReference(stackRefName);
const escEnv: string = stackRef.getOutput("escEnv");
const stackName = organization + "aws-oidc-typescript/example";

const workspace = LocalWorkspace.create({
    projectSettings: {
        name: "aws-oidc-typescript",
        runtime: "nodejs",
    },

}).then(ws => { ws.addEnvironments([escEnv]); });


let stack = workspace.selectStack(stackName);
export const callerArn = aws.getCallerIdentity({}).then(current => { current.arn });