var SERVICE_NAME = 'mailchimp';
var AUTH_URL = 'https://login.mailchimp.com/oauth2/authorize';
var TOKEN_URL = 'https://login.mailchimp.com/oauth2/token';
var CALLBACK_FUNCTION_NAME = 'authCallback';

function getRedirectURL() {
  var scriptId = ScriptApp.getScriptId();
  return 'https://script.google.com/macros/d/' + encodeURIComponent(scriptId) +
      '/usercallback';
}

/** Returns a parameterized OAuth2 Service object. */
function getOAuthService() {
  var scriptProps = PropertiesService.getScriptProperties();
  var clientID = scriptProps.getProperty('OAUTH_CLIENT_ID');
  var clientSecret = scriptProps.getProperty('OAUTH_CLIENT_SECRET');
  
  var redirectURL = getRedirectURL();
  
  var authURL = [
    AUTH_URL, 
    [
      'response_type=code',
      'client_id=' + clientID,
      'redirect_uri=' + redirectURL
    ].join('&')
  ].join('?');
  
  return OAuth2.createService(SERVICE_NAME)
    .setAuthorizationBaseUrl(authURL)
    .setTokenUrl(TOKEN_URL)
    .setClientId(clientID)
    .setClientSecret(clientSecret)
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setCallbackFunction(CALLBACK_FUNCTION_NAME);
}

/** The callback that is invoked after an authentication attempt. */
function authCallback(request) {
  var authorized = getOAuthService().handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

/** Returns {boolean} `true` if successfully authenticated--false otherwise. */
function isAuthValid() {
  return getOAuthService().hasAccess();
}

/** Resets the OAuth2 service. */
function resetAuth() {
  getOAuthService().reset();
}

/** Returns the 3P authorization urls for the service. */
function get3PAuthorizationUrls() {
  return getOAuthService().getAuthorizationUrl();
}

function isAdminUser() {
  var scriptProps = PropertiesService.getScriptProperties();
  var email = Session.getEffectiveUser().getEmail();

  return email === scriptProps.getProperty('ADMIN_EMAIL');
}