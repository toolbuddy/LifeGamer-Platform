# gameDatabase API

## gameDatabaseAPI

Offer API operating pd2royale game database.

### createConnect(host, user, passwd, db)

- `host` \<string> server host
- `user` \<string> mysql database username
- `passwd` \<string> mysql database password
- `db` \<string> mysql database name
- returns: \<Connection>
- Usage:
    
    return a connection that connects to server pd2royale mysql database.

### getUserRegisterStatus(con, username)

- `con` \<Connection> pd2royale mysql connection
- `username` \<string> user name
- returns: <Promise\<string>>
- Usage:

  ```javascript
  var con = pd2royaleDatabaseAPI.createConnect(host, user, passwd, db)
  var status = await pd2royaleDatabaseAPI.getMarkdownContent(con, 'A111222333');
  console.log(status); // registered or unregistered
  ```

  return the user status, `registered` or `unregistered`

### userRegister(con, username)

- `con` \<Connection> pd2royale mysql connection
- `username` \<string> user name
- returns: <Promise\<string>>
- Usage:

  ```javascript
  var con = pd2royaleDatabaseAPI.createConnect(host, user, passwd, db)
  await pd2royaleDatabaseAPI.userRegister(con, 'A111222333');
  ```

  setting user register status into `registered`

### getMemberList(con)

- `con` \<Connection> pd2royale mysql connection
- returns: <Promise\<Object>>
- Usage:

  ```javascript
  var con = pd2royaleDatabaseAPI.createConnect(host, user, passwd, db)
  var memberList = await pd2royaleDatabaseAPI.getMemberList(con) // list of all registered member
  ```

  getting all member list of pd2royale game

### getUserELO(con, username)

- `con` \<Connection> pd2royale mysql connection
- `username` \<string> user name
- returns: <Promise\<number>>
- Usage:

  ```javascript
  var con = pd2royaleDatabaseAPI.createConnect(host, user, passwd, db)
  var grade = pd2royaleDatabaseAPI.getUserELO(con, 'A111222333')
  ```

  getting user ELO

### updateUserELO(con, username, elo)

- `con` \<Connection> pd2royale mysql connection
- `username` \<string> user name
- `elo` \<number> user's elo
- returns: <Promise\<Object>>
- Usage:

  ```javascript
  var con = pd2royaleDatabaseAPI.createConnect(host, user, passwd, db)
  await pd2royaleDatabaseAPI.updateUserELO(con, 'A111222333', 1500)
  ```

  updating user's ELO

### setUserAttack(con, username, enemy)

- `con` \<Connection> pd2royale mysql connection
- `username` \<string> user name
- `enemy` \<string> enemy name
- returns: <Promise\<Object>>
- Usage:

  ```javascript
  var con = pd2royaleDatabaseAPI.createConnect(host, user, passwd, db)
  await pd2royaleDatabaseAPI.setUserAttack(con, 'A111222333', 'B333222111')
  ```

  setting user attacking target
