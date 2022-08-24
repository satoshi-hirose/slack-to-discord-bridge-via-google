# slack-to-discord-bridge-via-google

See also https://github.com/satoshi-hirose/slack2discord_migration

The comment posted on a Slack channel is forwarded to a corresponding Discord channel.
The attached files in Slack channel is uploaded to Google Drive and link to the file is put in Discord.
- real-time Sync
- serverless (Google Apps Script)

- Up to 15GB (Google free plan) file storage. Can boost with Google One 
- Up to 50MB file can be stored.

## Installation
Download Clipboard_for_installation.txt that is used as clipboard during the following steps.
Fill in the required information in the clipboard during following below step-by-step instruction.

### 1. Discord 
 - Create Discord channels with names identical to the channel in Slack.
 - Prepare webhook for each Discord channels (https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
 - Copy&Paste the channel names and webhool urls to DISCORD_WEBHOOK_LIST of the clipboard.

```
   DISCORD_WEBHOOK_LIST (don't forget to remove the comma at the end of the bottom line)

{"Webhook":[
{ "name": "general", "url": “https://discord.com/api/webhooks/..."},
{ "name": "random", "url": “https://discord.com/api/webhooks/..."},
.
.
.
{ "name": "XXXX", "url": “https://discord.com/api/webhooks/..."}
]}

```

### 2. Google drive
  - Create directory for json files (e.g. MyDrive/SLACK/json) 
  - Copy&Paste the diectoryID to GOOGLE_DRIVE_JSON_DIRECTORY_ID of the clipboard.
```  
     GOOGLE_DRIVE_JSON_DIRECTORY_ID 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
  - Create directory for saving attached files (e.g. myDrive/SLACK/files)
  - Copy&Paste the diectoryID to GOOGLE_DRIVE_FILE_DIRECTORY_ID of the clipboard.
```  
   GOOGLE_DRIVE_FILE_DIRECTORY_ID 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
  - Share the directory with “anyone with the link” as “Viewer”
  - Create a spreadsheet for log.
  - Copy&Paste the fileID to SPREADSHEET_ID of the clipboard.
```  
   SPREADSHEET_ID

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
  - Create a sheet in the spreadsheet you want to save the log.
  - Copy&Paste the fileID to SHEET_NAME of the clipboard.
```  
   SHEET_NAME

XXXX
```


  
  
  

### 3. Google Apps Script
  - Create new project
  - Copy&Paste the souce code "code.gs" in this repository to your "code.gs" and save
  - deploy -> new deploy -> webApps -> accessible user “anyone, even anonymous” 
  - Copy&Paste the Web Applicaion URL to GOOGLE_WEBAPP_URL of the clipboard.
  ```
      GOOGLE web app url

https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXX/exec
  ```
  
### 4. Slack API
  - Go to https://api.slack.com/apps -> create new app -> from scratch
  - Enter name and choose workspace -> create app
  - Copy&Paste Verification Token to VRIFICATRION_TOKEN of the clipboard.
```
    VERIFICATION_TOKEN
XXXXXXXXXXXXXXXXXX
```
   - OAuth & Permissions -> Scopes, Bot Token Scopes -> add Below 4 scopes
```
      - Channels:history
      - Channels:read
      - Files:read
      - users:read
```

   - Copy&Paste Bot User OAuth Token to SLACK_ACCESS_TOKEN of the clipboard
```
    SLACK_ACCESS_TOKEN

xoxb-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX    
```
   - Install to workspace
    
   - Event Subscriptions -> turn on 
   - Copy&Paste the GOOGLE_WEBAPP_URL in the clipboard to Request URL
   - See message "Verified" 
   - Subscribe to bot events -> add "message.channels" and save changes

### 5. Google Apps Script
   - Project Settings -> Edit Script Property
   - Add 7 script property listed below and copy&paste those property values from the clipboard
```   
- DISCORD_WEBHOOK_LIST
- GOOGLE_DRIVE_JSON_DIRECTORY_ID
- GOOGLE_DRIVE_FILE_DIRECTORY_ID
- SPREADSHEET_ID
- SHEET_NAME
- VERIFICATION_TOKEN
- SLACK_ACCESS_TOKEN
```
2, deploy -> manage deploy -> pencil mark -> new version -> deploy

### Slack
Add app to all the channels (mention the bot in each channel)

,
## Clipboard
```
   DISCORD_WEBHOOK_LIST (don't forget to remove the comma at the end of the bottom line)

{"Webhook":[
{ "name": "general", "url": “https://discord.com/api/webhooks/XXXXXXXXXXXX"},
{ "name": "random", "url": “https://discord.com/api/webhooks/XXXXXXXXXXXXX"},
.
.
.
{ "name": "XXXX", "url": “https://discord.com/api/webhooks/XXXXXXXXXXXXXXX"}
]}


   GOOGLE_DRIVE_JSON_DIRECTORY_ID 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


   GOOGLE_DRIVE_FILE_DIRECTORY_ID 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


   SPREADSHEET_ID

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


   SHEET_NAME

XXXX


   GOOGLE web app url

https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXX/exec


   VERIFICATION_TOKEN

XXXXXXXXXXXXXXXXXX


   SLACK_ACCESS_TOKEN

xoxb-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
