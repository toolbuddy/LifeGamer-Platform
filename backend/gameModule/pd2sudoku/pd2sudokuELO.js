const { gameDatabaseAPI } = require('../../API')

Date.prototype.pattern = function (fmt) {
    fmt = new Date((fmt - fmt.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace(/[A-Z]/g, ' ')
    return fmt
}


var pd2sudokuELO = {
  /**
   * @function
   * function for calculating ELO
   *
   * @param {Connection} con - game database connection
   * @param {string} p1 - player 1
   * @param {string} p2 - player 2
   * @param {number} result - game result, showing who win
   */
  async calculate (con, p1, p2, result) {
    let p1ELO = await gameDatabaseAPI.getUserELO(con, p1)
    let p2ELO = await gameDatabaseAPI.getUserELO(con, p2)
    let winner = null
    /* expected score */
    let expectP1 = 1 / (1 + 10 ** ((p2ELO - p1ELO) / 400))
    let expectP2 = 1 / (1 + 10 ** ((p1ELO - p2ELO) / 400))
    /* new score */
    let K = 32, S_A = null, S_B = null
    switch (result) {
      case 1: S_A = 1; S_B = 0; winner = p1; break // player 1 win
      case 2: S_A = 0; S_B = 1; winner = p2; break // player 2 win
      case 0: S_A = 0.5; S_B = 0.5; winner = 'None'; break // draw
      default: break
    }
    let p1NewELO = Math.floor(p1ELO + K * (S_A - expectP1))
    let p2NewELO = Math.floor(p2ELO + K * (S_B - expectP2))
    /* save ELO */
    await gameDatabaseAPI.updateUserPreELO(con, p1, p1ELO);
    await gameDatabaseAPI.updateUserPreELO(con, p2, p2ELO);

    await gameDatabaseAPI.updateUserELO(con, p1, p1NewELO)
    await gameDatabaseAPI.updateUserELO(con, p2, p2NewELO)

    /* insert record */
    let time = new Date()
    await gameDatabaseAPI.insertRecord(con, time.pattern(time), p1, p2, winner, p1NewELO - p1ELO, p2NewELO - p2ELO)
    console.log(`\x1b[32m${new Date().toISOString()} [pd2royaleELO operating] calculating ELO finish\x1b[0m`)
  }
}

module.exports = { pd2sudokuELO }
