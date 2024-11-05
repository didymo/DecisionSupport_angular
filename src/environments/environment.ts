export const environment = {
  production: false,

  //Authenticaiton Endpoints
  apiUrl: 'https://decisionsupportb.corporatememory.com.au/oauth/token',
  csrfTokenUrl: 'https://decisionsupportb.corporatememory.com.au/session/token',
  getUserDataUrl: 'https://decisionsupportb.corporatememory.com.au/user/1?_format=json',

  //Process Endpoints
  getProcessURL: 'https://decisionsupportb.corporatememory.com.au/rest/process/get/',
  getProcessListURL: 'https://decisionsupportb.corporatememory.com.au/rest/process/list',
  postProcessURL: 'https://decisionsupportb.corporatememory.com.au/rest/process/post',
  duplicateProcessURL: 'https://decisionsupportb.corporatememory.com.au/rest/process/duplicate',
  patchProcessURL: 'https://decisionsupportb.corporatememory.com.au/rest/process/patch/',
  updateProcessURL:'https://decisionsupportb.corporatememory.com.au/rest/process/update/',
  archiveProcessURL: 'https://decisionsupportb.corporatememory.com.au/rest/process/delete/',

   //Decision Support Endpoints
   getDecisionSupportURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/get/',
   getDecisionSupportListURL:  'https://decisionsupportb.corporatememory.com.au/rest/support/list',
   postDecisionSupportURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/post',
   patchDecisionSupportURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/update/',
   archiveDecisionSupportURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/archive/',

  //Document Upload Endpoints
  fileUploadURL: 'https://decisionsupportb.corporatememory.com.au/file/upload/decision_support_file/_/file',
  postDecisionSupportDocumentsURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/file/post',
  getDecisionSupportDocumentsURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/file/get/',
  archiveDecisionSupportDocumentsURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/file/delete/',

  getDecisionSupportReportURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/report/',
  getDecisionSupportReportListURL: 'https://decisionsupportb.corporatememory.com.au/rest/support/reportlist',
  //Client
  clientId: 'j_0y13c4wFccizwCDVVVtte-ATf3lsMeHe1VyRrGbWs',
  clientSecret: '5e9131f8fae88ae38e28d1805cbcfae93a8b60f5'
};
