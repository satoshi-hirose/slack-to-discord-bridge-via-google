# slack-to-discord-bridge-via-google

Slack channel comment post is forwarded to the Discord channel with the same name.
The attached files in Slack channel is uploaded to Google Drive and link is appeared in Discord.


## Installation
Fill in the required information in the Data Table during instration.
### Discord 
1, Create Discord channels with names identical to the channel in Slack.

2, Prepare webhook for each Discord channels (https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

3, prepare json-style text for the list of the names and webhook urls 
(Fill in the names and urls in DISCORD_WEBHOOK_LIST below)

### Google drive
1, Create directory for json files (e.g. myDrive/SLACK/json) 
         -> Fill in the directory ID in GOOGLE_DRIVE_JSON_DIRECTORY_ID
         
2, Create directory for saving attached files (e.g. myDrive/SLACK/files)
         -> Fill in the directory ID in GOOGLE_DRIVE_FILE_DIRECTORY_ID
         
3, Share GOOGLE_DRIVE_FILE_DIRECTORY with “anyone with the link” as “Viewer”

4, create a spreadsheet for log.
	-> Fill in the spreadsheet file ID in SPREADSHEET_ID
             and sheet name in SHEET_NAME

### Google Apps Script
1, copy & paste the souce code In code.gs -> save

2, deploy -> new deploy -> webApps -> accessible user “anyone, even anonymous”
 -> copy the URL (GOOGLE_WEBAPP_URL)

### Slack API
1, go to https://api.slack.com/apps -> create new app -> from scratch

2, enter name and choose workspace -> create app

3, Fill in Verification Token in VRIFICATRION_TOKEN

4 OAuth & Permissions -> Scopes, Bot Token Scopes -> add below -> OAuth Tokens for Your Workspace, install to workspace
- Channels:history
- Channels:read
- Files:read
- users:read

5, event subscriptions -> turn on -> Request URL: GOOGLE_WEBAPP_URL
　　-> Verified

6, Subscribe to bot events -> add below
   -> save changes
- message.channels

7, install App again
-> Fill in Bot User OAuth Token in SLACK_ACCESS_TOKEN

### Google Apps Script
1, Project Settings -> add below script property
- DISCORD_WEBHOOK_LIST
- GOOGLE_DRIVE_JSON_DIRECTORY_ID
- GOOGLE_DRIVE_FILE_DIRECTORY_ID
- SPREADSHEET_ID
- SHEET_NAME
- VERIFICATION_TOKEN
- SLACK_ACCESS_TOKEN

2, deploy -> manage deploy -> pencil mark -> new version -> deploy

### Slack
Add app to all the channels (mention the bot in each channel)


## Data Table

- DISCORD_WEBHOOK_LIST (don't forget to remove the comma at the end of the bottom line

{"Webhook":[
{ "name": "general", "url": “https://discord.com/api/webhooks/..."},
{ "name": "random", "url": “https://discord.com/api/webhooks/..."},
.
.
.
{ "name": "XXXX", "url": “https://discord.com/api/webhooks/..."}
]}


- GOOGLE_DRIVE_JSON_DIRECTORY_ID 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

- GOOGLE_DRIVE_FILE_DIRECTORY_ID 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

- SPREADSHEET_ID

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

- SHEET_NAME

XXXX

- GOOGLE web app url

https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXX/exec

- VERIFICATION_TOKEN

XXXXXXXXXXXXXXXXXX

- SLACK_ACCESS_TOKEN
xoxb-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
