const DRUPAL_BASE_URL = 'https://dsd11.didymodesigns.com.au';
const ANGULAR_APP_URL = 'https://decisionsupport.corporatememory.com.au';

export const environment = {
  production: true,

  auth: {
    issuerBaseUrl: DRUPAL_BASE_URL,
    authorizeEndpoint: '/oauth/authorize',
    tokenEndpoint: '/oauth/token',
    userInfoEndpoint: '/oauth/userinfo',
    logoutEndpoint: '/oauth/logout',
    logoutSessionEndpoint: '/oauth/logout/session',
    clientId: 'XhmOUsSHxrZqNut3ivBbG7Y3E2_raNQmAD-Z0SH6EDo',
    redirectUri: `${ANGULAR_APP_URL}/auth/callback`,
    logoutRedirectUri: `${ANGULAR_APP_URL}/user/login`,
    scopes: ['openid', 'offline_access', 'process_builder']
  },

  // Process endpoints
  getProcessURL: `${DRUPAL_BASE_URL}/rest/process/get/`,
  getProcessListURL: `${DRUPAL_BASE_URL}/rest/process/list`,
  postProcessURL: `${DRUPAL_BASE_URL}/rest/process/post`,
  duplicateProcessURL: `${DRUPAL_BASE_URL}/rest/process/duplicate`,
  patchProcessURL: `${DRUPAL_BASE_URL}/rest/process/patch/`,
  updateProcessURL: `${DRUPAL_BASE_URL}/rest/process/update/`,
  archiveProcessURL: `${DRUPAL_BASE_URL}/rest/process/delete/`,

  // Decision Support endpoints
  getDecisionSupportURL: `${DRUPAL_BASE_URL}/rest/support/get/`,
  getDecisionSupportListURL: `${DRUPAL_BASE_URL}/rest/support/list`,
  postDecisionSupportURL: `${DRUPAL_BASE_URL}/rest/support/post`,
  patchDecisionSupportURL: `${DRUPAL_BASE_URL}/rest/support/update/`,
  archiveDecisionSupportURL: `${DRUPAL_BASE_URL}/rest/support/archive/`,

  // Document Upload endpoints
  fileUploadURL: `${DRUPAL_BASE_URL}/file/upload/decision_support_file/_/file`,
  postDecisionSupportDocumentsURL: `${DRUPAL_BASE_URL}/rest/support/file/post`,
  getDecisionSupportDocumentsURL: `${DRUPAL_BASE_URL}/rest/support/file/get/`,
  archiveDecisionSupportDocumentsURL: `${DRUPAL_BASE_URL}/rest/support/file/archive/`,

  // Report endpoints
  getDecisionSupportReportURL: `${DRUPAL_BASE_URL}/rest/support/report/`,
  getDecisionSupportReportListURL: `${DRUPAL_BASE_URL}/rest/support/reportlist`
};
