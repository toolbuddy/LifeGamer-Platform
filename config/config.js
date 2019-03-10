const config = {
  development: {
    hostname: "https://pd2a.imslab.org",
    gameModule: 'pd2sudoku',
    db_database: "lifegamer_platform",
    projectName: "pd2-sudoku",
    ws_url: null,
    stageScore: {
      "Build with Makefile (5%)": 5,
      "Can transform (10%)": 10,
      "Generate problem (10%)": 10,
      "Solve lv1 (20%)": 20,
      "Solve lv2 (10%)": 10,
      "Solve lv3 (10%)": 10,
      "Speed lv1 (10%)": 10,
      "Speed lv2 (5%)": 5,
      "Speed lv3 (5%)": 5,
      "Finish normally (10%)": 10,
      "Coding style checking (5%)": 5
    }
  },
  production: {
    hostname: "https://pd2a.imslab.org",
    gameModule: 'pd2sudoku',
    db_database: "lifegamer_platform",
    projectName: "pd2-sudoku",
    ws_url: 'wss://pd2a.imslab.org/ws',
    stageScore: {
      "Build with Makefile (5%)": 5,
      "Can transform (10%)": 10,
      "Generate problem (10%)": 10,
      "Solve lv1 (20%)": 20,
      "Solve lv2 (10%)": 10,
      "Solve lv3 (10%)": 10,
      "Speed lv1 (10%)": 10,
      "Speed lv2 (5%)": 5,
      "Speed lv3 (5%)": 5,
      "Finish normally (10%)": 10,
      "Coding style checking (5%)": 5
    }
  }
};

module.exports = config;
