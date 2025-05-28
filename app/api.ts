const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function optimizeResume({ resume, jobdesc, userId, userEmail, userName }: { resume: File; jobdesc: string; userId: string; userEmail: string; userName: string }) {
  const formData = new FormData();
  formData.append("resume_pdf", resume);
  formData.append("jobdesc_text", jobdesc);

  const response = await fetch(`${API_BASE_URL}/optimize_resume/`, {
    method: "POST",
    body: formData,
    headers: {
      "X-User-ID": userId, // Pass the Supabase user ID
      "X-User-Email": userEmail, // Pass the user's email
      "X-User-Name": userName, // Pass the user's name
    },
  });

  if (!response.ok) {
    throw new Error("Failed to optimize resume");
  }

  // Parse JSON response to get download URL and feedback
  const result = await response.json();
  return result;
}

export async function downloadOptimizedResume(downloadUrl: string, userId: string, userEmail: string, userName: string, originalFilename?: string) {
  console.log("Downloading optimized resume from:", downloadUrl);
  const response = await fetch(`${API_BASE_URL}${downloadUrl}`, {
    headers: {
      "X-User-ID": userId, // Pass the Supabase user ID
      "X-User-Email": userEmail, // Pass the user's email
      "X-User-Name": userName, // Pass the user's name
    },
  });

  if (!response.ok) throw new Error("Failed to download optimized resume");

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Generate date string (YYYY-MM-DD format)
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // e.g., "2023-11-15"

  // Dynamic filename: append date to the original name
  const dynamicFilename = originalFilename
    ? `${originalFilename.replace(/\.[^/.]+$/, "")}_${dateString}.pdf`
    : `resume_${dateString}.pdf`;

  a.download = dynamicFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}