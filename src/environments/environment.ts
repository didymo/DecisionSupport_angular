export const environment = {
  production: false,

  //Authentication Endpoints
  apiUrl: 'http://decisionsupportprojectdrupal.local/oauth/token',
  csrfTokenUrl: 'http://decisionsupportprojectdrupal.local/session/token',

  //Process Endpoints
  getProcessURL: 'http://decisionsupportprojectdrupal.local/rest/process/get/',
  getProcessListURL: 'http://decisionsupportprojectdrupal.local/rest/process/list',
  postProcessURL: 'http://decisionsupportprojectdrupal.local/rest/process/post',
  duplicateProcessURL: 'http://decisionsupportprojectdrupal.local/rest/process/duplicate',
  patchProcessURL: 'http://decisionsupportprojectdrupal.local/rest/process/patch/',
  updateProcessURL:'http://decisionsupportprojectdrupal.local/rest/process/update/',
  archiveProcessURL: 'http://decisionsupportprojectdrupal.local/rest/process/delete/',

  //Decision Support Endpoints
  getDecisionSupportURL: 'http://decisionsupportprojectdrupal.local/rest/support/get/',
  getDecisionSupportReportURL: 'http://decisionsupportprojectdrupal.local/rest/support/report/',
  getDecisionSupportReportListURL: 'http://decisionsupportprojectdrupal.local/rest/support/reportlist',
  getDecisionSupportListURL: 'http://decisionsupportprojectdrupal.local/rest/support/list',
  postDecisionSupportURL: 'http://decisionsupportprojectdrupal.local/rest/support/post',
  patchDecisionSupportURL: 'http://decisionsupportprojectdrupal.local/rest/support/update/',
  archiveDecisionSupportURL: 'http://decisionsupportprojectdrupal.local/rest/support/archive/',

  //Document Upload Endpoints
  fileUploadURL: 'http://decisionsupportprojectdrupal.local/file/upload/decision_support_file/_/file',
  postDecisionSupportDocumentsURL: 'http://decisionsupportprojectdrupal.local/rest/support/file/post',
  getDecisionSupportDocumentsURL: 'http://decisionsupportprojectdrupal.local/rest/support/file/get/',
  archiveDecisionSupportDocumentsURL: 'http://decisionsupportprojectdrupal.local/rest/support/file/delete/',

  //Client
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
};
