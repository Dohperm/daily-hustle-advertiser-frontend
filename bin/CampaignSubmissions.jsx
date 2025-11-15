// import React, { useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useTheme } from "../../context/ThemeContext";
// import { useAdvertiserData } from "../../context/Advertiser/AdvertiserDataContext";

// export default function CampaignSubmissions() {
//   const { campaignId } = useParams();
//   const { theme } = useTheme();
//   const { getSubmissionsForCampaign, onApproveSubmission, onRejectSubmission } =
//     useAdvertiserData();

//   const [page, setPage] = useState(1);
//   const perPage = 8;
//   const submissions = getSubmissionsForCampaign(campaignId);

//   const isDark = theme === "dark";
//   const palette = useMemo(
//     () => ({
//       bg: isDark ? "#121212" : "#f8f9fa",
//       cardBg: isDark ? "#1c1c1e" : "#fff",
//       text: isDark ? "#f8f9fa" : "#212529",
//       label: isDark ? "#adb5bd" : "#6c757d",
//       red: "var(--dh-red, #ed3224)",
//       green: "#38d995",
//     }),
//     [isDark]
//   // );

//   const totalPages = Math.max(1, Math.ceil(submissions.length / perPage));
//   const visible = submissions.slice((page - 1) * perPage, page * perPage);

//   return (
//     <div
//       className="container py-4"
//       style={{ background: palette.bg, minHeight: 480 }}
//     >
//       <h2 className="fw-bold mb-4" style={{ color: palette.red }}>
//         Review Submissions
//       </h2>
//       {visible.length ? (
//         <>
//           {visible.map((sub) => (
//             <div
//               key={sub.id}
//               className="p-3 mb-3 rounded shadow-sm"
//               style={{ background: palette.cardBg }}
//             >
//               <div className="fw-bold mb-1">{sub.workerName}</div>
//               <div className="small mb-2">
//                 Proof: {sub.proof || "No proof provided"}
//               </div>
//               <div>
//                 <button
//                   className="btn btn-success mx-1"
//                   onClick={() => onApproveSubmission(sub.id)}
//                   disabled={sub.status === "approved"}
//                 >
//                   Approve
//                 </button>
//                 <button
//                   className="btn btn-danger mx-1"
//                   onClick={() => onRejectSubmission(sub.id)}
//                   disabled={sub.status === "rejected"}
//                 >
//                   Reject
//                 </button>
//                 <span
//                   className="small ms-2"
//                   style={{
//                     color:
//                       sub.status === "approved"
//                         ? palette.green
//                         : sub.status === "rejected"
//                         ? palette.red
//                         : palette.label,
//                   }}
//                 >
//                   {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
//                 </span>
//               </div>
//             </div>
//           ))}
//           {/* Pagination controls */}
//           {totalPages > 1 && (
//             <div className="d-flex justify-content-center mt-3">
//               <nav>
//                 <ul className="pagination">
//                   <li className={`page-item${page === 1 ? " disabled" : ""}`}>
//                     <button
//                       className="page-link"
//                       onClick={() => setPage(page - 1)}
//                     >
//                       Prev
//                     </button>
//                   </li>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <li
//                       key={i + 1}
//                       className={`page-item${page === i + 1 ? " active" : ""}`}
//                     >
//                       <button
//                         className="page-link"
//                         onClick={() => setPage(i + 1)}
//                       >
//                         {i + 1}
//                       </button>
//                     </li>
//                   ))}
//                   <li
//                     className={`page-item${
//                       page === totalPages ? " disabled" : ""
//                     }`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => setPage(page + 1)}
//                     >
//                       Next
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center py-5" style={{ color: palette.label }}>
//           No submissions yet.
//         </div>
//       )}
//     </div>
//   );
// }
