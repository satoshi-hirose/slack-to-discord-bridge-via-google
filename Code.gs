function doPost(e) {
  /* for test zone
  
  end for text  */ 
  // -------------------
  // ----- Get Data ----
  // -------------------
  const json = JSON.parse(e.postData.getDataAsString())

  // ---------------------
  // ----- Preprocess ----
  // ---------------------

  // For authorization 
  if (json.type == "url_verification") {return ContentService.createTextOutput(json.challenge)}

  // Verification Token
 if (json.token !== PropertiesService.getScriptProperties().getProperty('VERIFICATION_TOKEN')) {
   return ContentService.createTextOutput("invalid request");
 }

  // ignore non-message post
  if (json.event.type !== "message"){return ContentService.createTextOutput("")}

  // ignore resend post
  cache = CacheService.getPublicCache()
  let tmlog = cache.get("processed_ts")
  if (tmlog === null) {tmlog = ""}
  if (tmlog.indexOf(json.event.ts) !== -1){
    return ContentService.createTextOutput("OK");
  }
  cache.put("processed_ts", tmlog+","+ json.event.ts, 60*15);

  // -----------------------
  // ----- Main Process ----
  // -----------------------
  saveJSON(e)    
  writeSpreadsheetLog(json);
  sendMsgToDiscord(json)
}

// save json file to the specified directory. filename = json.event.ts (timestamp)
// require property GOOGLE_DRIVE_JSON_DIRECTORY_ID
function saveJSON(e) {
  const google_drive_json_directory_id = PropertiesService.getScriptProperties().getProperty('GOOGLE_DRIVE_JSON_DIRECTORY_ID')
  const textjs      = e.postData.getDataAsString();
  const fname        = JSON.parse(textjs).event.ts+".json";    
  const contentType = 'text/csv';
  const charset     = 'UTF-8';
  const folder      = DriveApp.getFolderById(google_drive_json_directory_id);
  const blob        = Utilities.newBlob('', contentType, fname).setDataFromString(textjs, charset);
  folder.createFile(blob);
}

// Message log in spreadsheet file
// Required property SPREADSHEET_ID, SHEET_NAME
function writeSpreadsheetLog(json){
  const spreadsheet_id    = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
  const sheet_name        = PropertiesService.getScriptProperties().getProperty('SHEET_NAME')
  const spreadSheet       = SpreadsheetApp.openById(spreadsheet_id);
  const sheet             = spreadSheet.getSheetByName(sheet_name);
  const username          = getUserName(json.event.user)
  const channelname       = getChannelName(json.event.channel)
  const text              = json.event.text
  sheet.appendRow([new Date(), username, channelname, text]); 
}

// Send message to Discord
// Required property DISCORD_WEBHOOK_LIST
function sendMsgToDiscord(json) {
  try{
    // target webhook for the target channel
    const discord_webhook_list  = JSON.parse(PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_LIST"))
    const chName                = getChannelName(json.event.channel)
    const webhook_url            = discord_webhook_list.Webhook.find((v) => v.name == chName).url
    
    // username
    const username              = getUserName(json.event.user)
    // text 
    let text = modifyMsgForDiscord(json.event.text)
  

    // attatched file
    const slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');  
    if (typeof json.event.files !== 'undefined'){
      json.event.files.forEach(function(element){
        let url = element.url_private
        let headers = {"Authorization" : "Bearer " +  slack_access_token};
        let params = {"method":"GET","headers":headers};
        let dlData = UrlFetchApp.fetch(url, params).getBlob();
        let google_drive_file_directory_id = PropertiesService.getScriptProperties().getProperty('GOOGLE_DRIVE_FILE_DIRECTORY_ID')
        let savedir = DriveApp.getFolderById(google_drive_file_directory_id)
        let driveFile = savedir.createFile(dlData)
        let driveFileURL = driveFile.getUrl()
        text　= text + "\n" + driveFileURL
      }) 
    }

    // Submit the Discord Comment
    const payload               = {username: username, content: text};
    UrlFetchApp.fetch(webhook_url, {method: "post",contentType: "application/json",payload: JSON.stringify(payload)});

    //error report
  } catch(error) {
      const payload               = {username: "BOT ERROR", content: error.message};
      const discord_webhook_list  = JSON.parse(PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_LIST"))
      const webhook_url = discord_webhook_list.Webhook[0].url
      UrlFetchApp.fetch(webhook_url, {method: "post",contentType: "application/json",payload: JSON.stringify(payload)});
    }
}


// -----------------------
// ----- Subfunctions ----
// -----------------------
function getUserName(userId){
  try{  
    const token     = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');  
    const options   = {"headers": { 'Authorization': 'Bearer ' + token }};
    const userData  = UrlFetchApp.fetch("https://slack.com/api/users.info?user="+userId,options);
    const userName  = JSON.parse(userData).user.real_name;
    return userName ? userName : userId; 
    }catch(error) {return userId}    
}

function getChannelName(channelId){
  try{  
    const token       = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');  
    const options     = {"headers": { 'Authorization': 'Bearer ' + token }};
    const channelData = UrlFetchApp.fetch("https://slack.com/api/conversations.info?channel="+channelId,options);
    const channelName = JSON.parse(channelData).channel.name;
    return channelName ? channelName : channelId;
    }catch(error){return channelId}
}

function modifyMsgForDiscord(text){
  let newtext = text
  // person & channel mention
  newtext     = newtext.replace(/<@([A-Z0-9]{1,21})>/g,function(all,p){return "@"+getUserName(p)}) 
  newtext     = newtext.replace(/<#([A-Z0-9]{1,21})\|(.{1,15})>/g,"#$2")
  // replace url
  newtext     = newtext.replace(/(<|\|)(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/g,
                function(all){return "\n　"+all.slice(1)})
  newtext     = newtext.replace(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)>/g,
                function(all){return all.slice(0,-1)+"\n"})
  
  // unescape HTML Special characters　added on 8/23
  newtext = newtext.replace(/(&amp;|&lt;|&gt;)/g,function(match){return {'&amp;' : '&',　'&lt;': '<',　'&gt;': '>'}[match]})
  
  // cut >2000 char
  newtext = newtext.slice(0,2000)
return newtext
}
