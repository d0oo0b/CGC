/*
Author: Shen Hong
*/

function consoleBlock(msgInfo){
    var m = $("<div class='console_row console_row_blink'></div>");
    m.text(msgInfo);
    if(msgInfo.indexOf("Error")>=0){
        m.attr("class", "console_row console_row_blink console_error_msg");
    }
    if($(".console_block")){
        $(".console_block").append(m);
        $(".console_block").scrollTop($(".console_block")[0].scrollHeight);
    }
}

function requestUrlParas(paras){ 
    var url = location.href;
    var paraString = url.substring(url.indexOf("#")+1,url.length).split("&"); 
    var paraObj = {} 
    for (i=0; j=paraString[i]; i++){ 
    	paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
    } 
    var returnValue = paraObj[paras.toLowerCase()]; 
    if(typeof(returnValue)=="undefined"){ 
    	return ""; 
    }else{ 
    	return returnValue; 
    } 
}

// Set the region where your identity pool exists (us-east-1, eu-west-1)
AWS.config.region = 'us-east-1';

// Configure the credentials provider to use your identity pool
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '******IdentityPoolId******', 
                Logins : {
                  // Change the key below according to the specific region your user pool is in.
                  'cognito-idp.us-east-1.amazonaws.com/us-east-xxxxxx' : requestUrlParas("id_token")
                }
});

// Make the call to obtain credentials
AWS.config.credentials.get(function(err){
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
    console.log("accessKeyId:"+accessKeyId);
    console.log("secretAccessKey:"+secretAccessKey);
    console.log("sessionToken:"+sessionToken);
    if (!err) {
        // Instantiate aws sdk service objects now that the credentials have been updated
        $.getScript("./static/wallet.js");
    }else{
        console.log("Error:"+err);
        alert("Login First");
        window.location.href='https://xxxxxx/wallet.html';
    }
});
