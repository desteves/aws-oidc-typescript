import axios from 'axios';

// YES THIS IS LESS THAN IDEAL
// BUT IT'S THE BEST WE CAN DO FOR NOW
// UNTIL PULUMI SUPPORTS THIS FUNCTIONALITY
// https://www.pulumi.com/docs/pulumi-cloud/cloud-rest-api/#create-environment
export default function createESCEnvironment(data: string, organization:string, environment:string, token:string): void {
    
    const headers = {
        'Accept': 'application/vnd.pulumi+8',
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`,
    };

    axios.post(`https://api.pulumi.com/api/preview/environments/${organization}/${environment}`, data, { headers })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error.toString());
        });
}