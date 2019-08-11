import { getPowerRankings } from './FantasyFootballApiv2';

describe('API', () => {
  it('should calculate the rankings', async () => {
    const rankings = await getPowerRankings();
    expect(rankings[0].totalWins).toEqual(88);
    expect(rankings[0].totalLosses).toEqual(44);
    expect(rankings[11].totalWins).toEqual(40);
    expect(rankings[11].totalLosses).toEqual(92);
  });
});
