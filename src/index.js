var cc = DataStudioApp.createCommunityConnector();

function getAuthType() {
  return cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.OAUTH2)
    .build();
}

function getConfig() {
  var config = cc.getConfig();

  config
    .newInfo()
    .setId('info')
    .setText(
      'No configuration is required for this connector. Click (re)connect to create the data source.'
    );

  config.setDateRangeRequired(true);

  return config.build();
}

function getSchema() {
  return {schema: getFields().build()};
}

function getData(request) {  
  var requestedFields = getFields().forIds(
    request.fields.map(function(field) {
      return field.name;
    })
  );

  return {
    schema: requestedFields.build(),
    rows: []
  };
}