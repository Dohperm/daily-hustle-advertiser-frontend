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
export const advertiserListMyTasks = () => api.get("/tasks");

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
 * PATCH /task-proof/{taskProofId} 
 * Body:
 * {
 *   "status": "approved" | "rejected",
 *   // other fields if needed
 * }
 */
export const advertiserUpdateTaskProofStatus = (taskProofId, data) =>
  api.patch(`/task-proof/${taskProofId}`, data);
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
 * GET /task-proof?task_id={taskId} 
 * No body. Query param: task_id
 */
export const advertiserListSubmissions = (taskId) =>
  api.get("/task-proof", { params: { task_id: taskId } });

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
export const advertiserTransactions = () => api.get("/transactions/advertisers");

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
