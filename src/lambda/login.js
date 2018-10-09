import axios from 'axios';

export const handler = async event => {
    try {
        const body = JSON.parse(event.body);
        const { username, password } = body;
        let apiKey = await getApiKey();
        const response = await login(username, password, apiKey);
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    } catch(e) {
        console.error(JSON.stringify(e.response.data, null, 2));
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "Username/Password incorrect."})
        }
    }
}

const getApiKey = async () => {
    const response = await axios.post('https://ha.registerdisney.go.com/jgc/v6/client/ESPN-ONESITE.WEB-PROD/api-key?langPref=en-US');
    return response.headers['api-key'];
}

const login = async (loginValue, password, apiKey) => {
    const request = { loginValue, password };
    const headers = {'authorization' : `APIKEY ${apiKey}`, 'content-type': "application/json"}
    const response = await axios.post('https://ha.registerdisney.go.com/jgc/v6/client/ESPN-ONESITE.WEB-PROD/guest/login?langPref=en-US', request, {headers}) 
    return {
        s2: response.data.data.s2,
        swid: response.data.data.profile.swid
    }
}