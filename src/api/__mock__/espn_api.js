const fs = require('fs');

export const scoreboard_response = week => {
  return require('./scoreboard-' + week + '.json');
};
