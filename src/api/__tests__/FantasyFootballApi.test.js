import { FantasyFootballApi } from '../FantasyFootballApi';
import { scoreboard_response } from '../__mock__/espn_api';

describe('FantasyFootballApi Tests', () => {
  describe('ESPN API', () => {
    const api = new FantasyFootballApi();

    it('parse week 1 scoreboard', () => {
      const data = api.buildWeekScores(scoreboard_response(1).scoreboard.matchups);
      expect(data.length).toEqual(13);
      expect(data).toMatchSnapshot();
    });

    it('parse week scoreboard (not played yet - all undecided', () => {
      const data = api.buildWeekScores(scoreboard_response(2).scoreboard.matchups);

      expect(data).toMatchSnapshot();
      expect(data.length).toEqual(0);
    });
  });
});
