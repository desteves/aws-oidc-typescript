import axios from 'axios';

// YES THIS IS LESS THAN IDEAL
// BUT IT'S THE BEST WE CAN DO FOR NOW
// UNTIL PULUMI SUPPORTS THIS FUNCTIONALITY
// https://www.pulumi.com/docs/pulumi-cloud/cloud-rest-api/#create-environment
// https://github.com/pulumi/pulumi-pulumiservice/issues/225
export default function upsertEnvironment(data: string, organization: string, environment: string, token: string): void {

    const headers = {
        'Accept': 'application/vnd.pulumi+8',
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`,
    };

    axios.get(`https://api.pulumi.com/api/preview/environments/${organization}/${environment}`, { headers })
        .then(response => {
            if (response.status === 200) {
                console.log("!! Whoops a found an existing Environment, updating it...")

                axios.patch(`https://api.pulumi.com/api/preview/environments/${organization}/${environment}`, data, { headers })
                    .then(response => {
                        console.log(response.status);
                    })
                    .catch(error => {
                        if (error.response) {
                            if (error.response.status === 401) {
                                console.error('Unauthorized: Please check your Pulumi access token');
                            } else if (error.response.status === 409) {
                                console.error('ESC Environment already exists');
                            } else if (error.response.status === 400) {
                                console.error('Check your YAML configuration');
                            }
                        }
                        console.error(error.toString());
                    });
            }
        }).catch(error => {
            if (error.response) {
                if (error.response.status === 401) {
                    console.error('Unauthorized: Please check your Pulumi access token');
                } else if (error.response.status == 404) {
                    axios.post(`https://api.pulumi.com/api/preview/environments/${organization}/${environment}`, data, { headers })
                        .catch(error => {
                            if (error.response) {
                                if (error.response.status === 401) {
                                    console.error('Unauthorized: Please check your Pulumi access token');
                                } else if (error.response.status === 409) {
                                    console.error('ESC Environment already exists');
                                } else if (error.response.status === 400) {
                                    console.error('Check your YAML configuration');
                                }
                            }
                            console.error(error.toString());
                        });
                }
            }
        })
}

