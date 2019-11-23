import { getPowerRankings } from './FantasyFootballApiv2';
import axios from 'axios';
import response from './response.json';

jest.mock('axios', () => ({
  get: jest.fn(),
  defaults: {}
}));

jest.mock('@3846masa/axios-cookiejar-support');

describe('API', () => {
  it('should calculate the rankings', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: response }));
    const rankings = await getPowerRankings('123', 2019, false, {});
    expect(rankings[0].totalWins).toEqual(88);
    expect(rankings[0].totalLosses).toEqual(44);
    expect(rankings[11].totalWins).toEqual(40);
    expect(rankings[11].totalLosses).toEqual(92);
  });
});
