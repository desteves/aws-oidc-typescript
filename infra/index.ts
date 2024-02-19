import * as pulumi from "@pulumi/pulumi";
import * as pulumiservice from "@pulumi/pulumiservice";
import * as aws from "@pulumi/aws";
import { stringify } from 'yaml'
import upsertEnvironment from './preview-api-esc';
import { exit } from "process";

// Configurations
const audience = pulumi.getOrganization();
const config = new pulumi.Config();
const oidcIdpUrl: string = config.require('oidcIdpUrl');
const thumbprint: string = config.require('thumbprint');
export const escEnv: string = config.require('escEnv');


// Check if resource already exists under the provided AWS Account.
try {
    aws.iam.getOpenIdConnectProvider({
        url: oidcIdpUrl,
    }).then(temp => {
        console.log("!! Whoops a conflict has been detected; import your existing OIDC Provider")
        console.log("pulumi import aws:iam/openIdConnectProvider:OpenIdConnectProvider default ", temp.arn)
        exit(1)
    });
} catch {

}

// !! If importing an existing oidc provider, update the below resource accordingly
// Create a new OIDC Provider
const oidcProvider = new aws.iam.OpenIdConnectProvider("oidcProvider", {
    clientIdLists: [audience],
    url: oidcIdpUrl, // Replace with your IdP URL
    thumbprintLists: [thumbprint], // Replace with the thumbprint of the IdP server's certificate
});

// Create a new role that can be assumed by the OIDC provider
const role = new aws.iam.Role("oidcProviderRole", {
    assumeRolePolicy: pulumi.all([oidcProvider.url, oidcProvider.arn, audience]).apply(([url, arn, audience]) => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: { Federated: arn },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: { StringEquals: { [`${url}:aud`]: [audience] } },
        }],
    })),
});

// TODO - attach other policies to the role as needed
try {
    console.log("Attempting to give the role an AdministratorAccess policy.")
    new aws.iam.RolePolicyAttachment("oidcProviderRolePolicyAttachment", {
        role: role,
        policyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
    });
} catch (error) {
    console.warn("Unable to attach the AdministratorAccess policy to the " + role.name)
} finally {
    console.log("Please add/remove policies as necessary.")
}

// Create a new Pulumi Cloud access token to be used to create the Environment
const accessToken = new pulumiservice.AccessToken("myAccessToken", {
    description: "Used to create an ESC Environment for AWS OIDC",
}, { dependsOn: [role] });

accessToken.value.apply(tokenId => {
    role.arn.apply(arn => {
        const yamlStr = stringify(
            {
                "values": {
                    "aws": {
                        "login": {
                            "fn::open::aws-login": {
                                "oidc": {
                                    "duration": "1h",
                                    "roleArn": `${arn}`,
                                    "sessionName": "pulumi-environments-session"
                                }
                            }
                        }
                    },
                    "environmentVariables": {
                        "AWS_ACCESS_KEY_ID": "${aws.login.accessKeyId}",
                        "AWS_SECRET_ACCESS_KEY": "${aws.login.secretAccessKey}",
                        "AWS_SESSION_TOKEN": "${aws.login.sessionToken}"
                    }
                },
            }
        );
        upsertEnvironment(yamlStr, audience, escEnv, tokenId);
    });
});
