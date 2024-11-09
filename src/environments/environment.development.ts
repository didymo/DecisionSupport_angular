export const environment = {
  production: false,

  //Authenticaiton Endpoints
  apiUrl: 'https://dsd10.didymodesigns.com.au/oauth/token',
  csrfTokenUrl: 'https://dsd10.didymodesigns.com.au/session/token',
  getUserDataUrl: 'https://dsd10.didymodesigns.com.au/user/1?_format=json',

  //Process Endpoints
  getProcessURL: 'https://dsd10.didymodesigns.com.au/rest/process/get/',
  getProcessListURL: 'https://dsd10.didymodesigns.com.au/rest/process/list',
  postProcessURL: 'https://dsd10.didymodesigns.com.au/rest/process/post',
  duplicateProcessURL: 'https://dsd10.didymodesigns.com.au/rest/process/duplicate',
  patchProcessURL: 'https://dsd10.didymodesigns.com.au/rest/process/patch/',
  updateProcessURL:'https://dsd10.didymodesigns.com.au/rest/process/update/',
  archiveProcessURL: 'https://dsd10.didymodesigns.com.au/rest/process/delete/',

   //Decision Support Endpoints
   getDecisionSupportURL: 'https://dsd10.didymodesigns.com.au/rest/support/get/',
   getDecisionSupportListURL:  'https://dsd10.didymodesigns.com.au/rest/support/list',
   postDecisionSupportURL: 'https://dsd10.didymodesigns.com.au/rest/support/post',
   patchDecisionSupportURL: 'https://dsd10.didymodesigns.com.au/rest/support/update/',
   archiveDecisionSupportURL: 'https://dsd10.didymodesigns.com.au/rest/support/archive/',

  //Document Upload Endpoints
  fileUploadURL: 'https://dsd10.didymodesigns.com.au/file/upload/decision_support_file/_/file',
  postDecisionSupportDocumentsURL: 'https://dsd10.didymodesigns.com.au/rest/support/file/post',
  getDecisionSupportDocumentsURL: 'https://dsd10.didymodesigns.com.au/rest/support/file/get/',
  archiveDecisionSupportDocumentsURL: 'https://dsd10.didymodesigns.com.au/rest/support/file/delete/',

  getDecisionSupportReportURL: 'https://dsd10.didymodesigns.com.au/rest/support/report/',
  getDecisionSupportReportListURL: 'https://dsd10.didymodesigns.com.au/rest/support/reportlist',
  //Client
  clientId: 'j_0y13c4wFccizwCDVVVtte-ATf3lsMeHe1VyRrGbWs',
  clientSecret: '5e9131f8fae88ae38e28d1805cbcfae93a8b60f5'
};
