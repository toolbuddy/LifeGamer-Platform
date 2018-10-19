# Changelog

## Unreleased

## [1.1.0] - 2018-04-04
### Added
- BattleField page
    - User's pd2royale game data stored in server database
    - User can select attack/defend code version and fight with others in battle mode
    - User can watch all fight replay in replay mode


## [1.0.0] - 2018-03-20
### Added
- Commit page
    - User can select branch and commit to ask server posting pipeline.
    - Page would render game process getting from server via websocket.
    - If user close website, refresh website, or exit commit page, websocket would disconnect.
    - If server status is 'off', it would send user back to login page.
- Grade page
    - User can see all his/her pipelines grade and details here
    - After entering grade page, it would auto updating user score to server database.
    - User can click detail button to see all jobs status in pipeline selected.
- Resource page
    - Content stored in server database
    - Use markdown to write content
    - When logging in with admin account, user will be able to modify board content from website.

### Changed
- Login page
    - Now if server status is 'off' and user is not admin, it would not let user using platform.

## [0.1.1] - 2018-03-01
### Fixed
- Some hostname don't follow config
- Announcement edit page layout broken

## [0.1.0] - 2018-03-01
### Added
- Announce board
    - Content stored in server database
    - When logged in with Gitlab admin account, user will be able to modify board content from website
    - Use markdown to write content
- Server deploy
    - Now CI will deploy master and dev branch to different server
- Sidebar entry has new icon style
- Added background to login page

### Changed
- User will be kicked out from Gitlab when logout.
- cookie will be cleared when browser closed.

## [0.0.1] - 2018-02-08
### Added
- Oauth user authentication provided by out Gitlab server.
- Retrieve user data (name/ID/avatar) using Gitlab API.
- Webpage components prototype.
- Backend resource handler.
