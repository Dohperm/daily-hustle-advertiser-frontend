// src/api/advertiserServices.js
import api from "./api";

/* -------------------------------------------------------------------------- */
/*                               ADVERTISER AUTH                             */
/* -------------------------------------------------------------------------- */

/**
 * Register a new advertiser
 * POST /auths/advertisers/register 
 * Body:
 * {
 *   // registration fields (e.g., name, email, password, etc.)
 * }
 */
export const advertiserRegister = (data) =>
  api.post("/auths/advertisers/register", data);

/**
 * Verify if username is available
 * POST /auths/advertisers/verify-username
 * Body: { "username": "string" }
 */
export const advertiserVerifyUsername = (username) =>
  api.post("/auths/advertisers/verify-username", { username });

/**
 * Validate advertiser registration token
 * POST /auths/advertisers/register/validate-token
 * 
//  
 * 
 * Body:
 * {
 *   "token": "string",
 *   "email": "string"
 * }
 */
export const advertiserValidateRegistrationToken = (data) =>
  api.post("/auths/advertisers/register/validate-token", data);

/**
 * Advertiser login
 * POST /auths/advertisers/login 
 * Body:
 * {
 *   "email": "string",
 *   "password": "string"
 * }
 */
export const advertiserLogin = (data) =>
  api.post("/auths/advertisers/login", data);

/**
 * OAuth login with Google/Facebook for advertisers
 * POST /auths/advertisers/oauth-login
 * Body:
 * {
 *   "firebase_token": "string"
 * }
 */
export const advertiserOauthLogin = (firebaseToken) =>
  api.post("/auths/advertisers/oauth-login", { firebase_token: firebaseToken });

/**
 * Get advertiser profile
 * GET /advertisers/me
 * No params or body
 */
export const advertiserProfile = () => api.get("/advertisers/me");

/* -------------------------------------------------------------------------- */
/*                                   TASKS                                    */
/* -------------------------------------------------------------------------- */

/**
 * Get all tasks for advertisers
 * GET /tasks/advertisers
 * No params or body
 */
export const advertiserListAllTasks = () => api.get("/tasks/advertisers");
// the error i had here was due to the fact that the  route i added was /advertisers instead of beloe 
// so now i will use this below as the bckedne route should have been , hopefully this fixes the error i had  been called to
// \\\\\\\\\\\\\\\\\|||||||||||||||//this next line\\|||||||||||||||||////////////////// \\
export const advertiserListMyTasks = () => api.get("/tasks/advertisers");

/**
 * Create a new task
 * POST /tasks 
 * Body:
 * {
 *   // task fields (e.g., title, description, reward, etc.)
 * }
 */
export const advertiserCreateTask = (data) => api.post("/tasks", data);

/**
 * View a single task
 * GET /tasks/{taskId}/advertisers 
 * No body
 */
export const advertiserViewTask = (taskId) =>
  api.get(`/tasks/${taskId}/advertisers`);

/* -------------------------------------------------------------------------- */
/*                               TASK PROOF                                   */
/* -------------------------------------------------------------------------- */

/**
 * Approve or reject a task proof
 * POST /tasks/submissions/advertisers 
 * Body:
 * {
 *   "approval_status": "approved" | "rejected" | "resubmit",
 *   "task_proof_id": "string"
 * }
 */
export const advertiserUpdateTaskProofStatus = (taskProofId, data) =>
  api.post("/tasks/submissions/advertisers", data);
/**
 * Update a task
 * PATCH /tasks/{taskId}/advertisers 
 * Body:
 * {
 *   // fields to update (e.g., title, description, reward, etc.)
 * }
 */
export const advertiserUpdateTask = (taskId, data) =>
  api.patch(`/tasks/${taskId}/advertisers`, data);
/**
 * List submissions for a task
 * GET /tasks/submissions/advertisers?task_id={taskId} 
 * No body. Query param: task_id
 */
export const advertiserListSubmissions = (taskId) =>
  api.get("/tasks/submissions/advertisers", { params: { task_id: taskId } });

/**
 * Get submission stats for a task
 * GET /task-proof/submission-stats?task_id={taskId} 
 * No body. Query param: task_id
 */
export const advertiserSubmissionStats = (taskId) =>
  api.get("/task-proof/submission-stats", { params: { task_id: taskId } });

/* -------------------------------------------------------------------------- */
/*                                 DASHBOARD / STATS                          */
/* -------------------------------------------------------------------------- */

/**
 * Get advertiser task stats (completed and active campaigns)
 * GET /tasks/stats/advertisers
 * No params or body
 */
export const advertiserTaskStats = () => api.get("/tasks/stats/advertisers");

/**
 * Get advertiser wallet balance
 * GET /advertisers/me/wallet-balance
 * No params or body
 */
export const advertiserWalletBalance = () => api.get("/advertisers/me/wallet-balance");

/**
 * Get advertiser transactions
 * GET /transactions
 * No params or body
 */
export const advertiserTransactions = (queryParams = '') => api.get(`/transactions/advertisers${queryParams}`);

export const advertiserTotalSpent = () => api.get("/transactions/advertisers/stats/total-spent");

export const initializePayment = (amount) => {
  return api.post("/payments/initialize", { amount });
};

export const verifyPayment = (reference) => {
  return api.get(`/payments/verify/${reference}`);
};

// for file upload
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("files", file); // keep the key that the backend expects
  return api.post("/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadImage = uploadFile; // identical
