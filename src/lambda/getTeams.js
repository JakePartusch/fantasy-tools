import axios from 'axios';

export const handler = async event => {
    const body = JSON.parse(event.body);
    const { swid } = body;
    const encodedSwid = encodeURIComponent(swid)
    const url = `http://fan.api.espn.com/apis/v2/fans/${encodedSwid}?xhr=1&displayEvents=true&displayNow=true&displayRecs=true&recLimit=5&userId=${encodedSwid}&source=ESPN.com+-+FAM`;
    try {
        const response = await axios.get(url);
        const ids = response.data.preferences
                        .map( preference => {
                            const splitPreference = preference.id.split(":");
                            const leagueId = splitPreference[1];
                            const seasonId = splitPreference[3];
                            const leagueName = preference.metaData.entry.groups[0].groupName
                            return {
                                leagueId,
                                seasonId,
                                leagueName
                            }
                        })
        return {
            statusCode: 200,
            body: JSON.stringify(ids, null, 2)
        }
    } catch(e) {
        console.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message : "Unable to retrieve teams"})
        }
    }
}