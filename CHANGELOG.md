# Changelog

## Unreleased

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
