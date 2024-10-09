export const environment = {
  production: false,

  //Authentication Endpoints
  apiUrl: 'http://drupaldecisionsupport.local/oauth/token',
  csrfTokenUrl: 'http://drupaldecisionsupport.local/session/token',

  //Process Endpoints
  getProcessURL: 'http://drupaldecisionsupport.local/rest/process/get/',
  getProcessListURL: 'http://drupaldecisionsupport.local/rest/process/list',
  postProcessURL: 'http://drupaldecisionsupport.local/rest/process/post',
  duplicateProcessURL: 'http://drupaldecisionsupport.local/rest/process/duplicate',
  patchProcessURL: 'http://drupaldecisionsupport.local/rest/process/patch/',
  updateProcessURL:'http://drupaldecisionsupport.local/rest/process/update/',
  archiveProcessURL: 'http://drupaldecisionsupport.local/rest/process/delete/',

  //Decision Support Endpoints
  getDecisionSupportURL: 'http://drupaldecisionsupport.local/rest/support/get/',
  getDecisionSupportReportURL: 'http://drupaldecisionsupport.local/rest/support/report/',
  getDecisionSupportReportListURL: 'http://drupaldecisionsupport.local/rest/support/reportlist',
  getDecisionSupportListURL: 'http://drupaldecisionsupport.local/rest/support/list',
  postDecisionSupportURL: 'http://drupaldecisionsupport.local/rest/support/post',
  patchDecisionSupportURL: 'http://drupaldecisionsupport.local/rest/support/update/',
  archiveDecisionSupportURL: 'http://drupaldecisionsupport.local/rest/support/archive/',

  //Document Upload Endpoints
  fileUploadURL: 'http://drupaldecisionsupport.local/file/upload/decision_support_file/_/file',
  postDecisionSupportDocumentsURL: 'http://drupaldecisionsupport.local/rest/support/file/post',
  getDecisionSupportDocumentsURL: 'http://drupaldecisionsupport.local/rest/support/file/get/',
  archiveDecisionSupportDocumentsURL: 'http://drupaldecisionsupport.local/rest/support/file/delete/',

  //Client
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
};
