export const environment = {
  production: false,

  //Authentication Endpoints
  apiUrl: 'http://complaintdrupal.local/oauth/token',
  csrfTokenUrl: 'http://complaintdrupal.local/session/token',

  //Process Endpoints
  getProcessURL: 'http://complaintdrupal.local/rest/process/get/',
  getProcessListURL: 'http://complaintdrupal.local/rest/process/list',
  postProcessURL: 'http://complaintdrupal.local/rest/process/post',
  duplicateProcessURL: 'http://complaintdrupal.local/rest/process/duplicate',
  patchProcessURL: 'http://complaintdrupal.local/rest/process/patch/',
  updateProcessURL:'http://complaintdrupal.local/rest/process/update/',
  archiveProcessURL: 'http://complaintdrupal.local/rest/process/delete/',

  //Decision Support Endpoints
  getDecisionSupportURL: 'http://complaintdrupal.local/rest/support/get/',
  getDecisionSupportListURL: 'http://complaintdrupal.local/rest/support/list',
  postDecisionSupportURL: 'http://complaintdrupal.local/rest/support/post',
  patchDecisionSupportURL: 'http://complaintdrupal.local/rest/support/update/',
  archiveDecisionSupportURL: 'http://complaintdrupal.local/rest/support/archive/',

 //Document Upload Endpoints
 fileUploadURL: 'http://complaintdrupal.local/file/upload/decision_support_file/_/file',
 postDecisionSupportDocumentsURL: 'http://complaintdrupal.local/rest/support/file/post',
 getDecisionSupportDocumentsURL: 'http://complaintdrupal.local/rest/support/file/get/',
 archiveDecisionSupportDocumentsURL: 'http://complaintdrupal.local/rest/support/file/archive/',

  //Client
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
};