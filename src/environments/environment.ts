const BASE_URL = 'https://dsd11.didymodesigns.com.au';

export const environment = {
  production: true,

  auth: {
    issuerBaseUrl: BASE_URL,
    authorizeEndpoint: '/oauth/authorize',
    tokenEndpoint: '/oauth/token',
    userInfoEndpoint: '/oauth/userinfo',
    logoutEndpoint: '/oauth/logout',
    clientId: 'XhmOUsSHxrZqNut3ivBbG7Y3E2_raNQmAD-Z0SH6EDo',
    redirectUri: 'https://decisionsupport.didymodesigns.com.au/auth/callback',
    logoutRedirectUri: 'https://decisionsupport.didymodesigns.com.au/user/login',
    scopes: ['openid', 'offline_access']
  },

  // Process endpoints
  getProcessURL: `${BASE_URL}/rest/process/get/`,
  getProcessListURL: `${BASE_URL}/rest/process/list`,
  postProcessURL: `${BASE_URL}/rest/process/post`,
  duplicateProcessURL: `${BASE_URL}/rest/process/duplicate`,
  patchProcessURL: `${BASE_URL}/rest/process/patch/`,
  updateProcessURL: `${BASE_URL}/rest/process/update/`,
  archiveProcessURL: `${BASE_URL}/rest/process/delete/`,

  // Decision Support endpoints
  getDecisionSupportURL: `${BASE_URL}/rest/support/get/`,
  getDecisionSupportListURL: `${BASE_URL}/rest/support/list`,
  postDecisionSupportURL: `${BASE_URL}/rest/support/post`,
  patchDecisionSupportURL: `${BASE_URL}/rest/support/update/`,
  archiveDecisionSupportURL: `${BASE_URL}/rest/support/archive/`,

  // Document Upload endpoints
  fileUploadURL: `${BASE_URL}/file/upload/decision_support_file/_/file`,
  postDecisionSupportDocumentsURL: `${BASE_URL}/rest/support/file/post`,
  getDecisionSupportDocumentsURL: `${BASE_URL}/rest/support/file/get/`,
  archiveDecisionSupportDocumentsURL: `${BASE_URL}/rest/support/file/archive/`,

  // Report endpoints
  getDecisionSupportReportURL: `${BASE_URL}/rest/support/report/`,
  getDecisionSupportReportListURL: `${BASE_URL}/rest/support/reportlist`
};
