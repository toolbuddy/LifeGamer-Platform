# Changelog

## Unreleased

## [1.0.0] - 2018-04-04
### Added
- BattleField
    - User pd2royale game data stored in server database
    - User can select attack/defend code version and fight with others in battle mode
    - User can watch all fight replay in replay mode
- Commit Page
    - User select branch, commit version for judging
    - After selecting, server will send judging process to the client
- Grade Page
    - After Judging, user can enter grade page to see the grade and details
    - System will auto save the highest grade into server database


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
