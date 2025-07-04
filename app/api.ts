const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function optimizeResume({ resume, jobdesc, jobTitle, company, resumeTemplate, userId, userEmail, userName }: { resume: File; jobdesc: string; jobTitle?: string; company?: string; resumeTemplate?: string; userId: string; userEmail: string; userName: string }) {
  const formData = new FormData();
  formData.append("resume_pdf", resume);
  formData.append("jobdesc_text", jobdesc);
  if (jobTitle) formData.append("job_title", jobTitle);
  if (company) formData.append("company", company);
  if (resumeTemplate) formData.append("resume_template", resumeTemplate);

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

export async function getResumeHistory(
  userId: string, 
  userEmail: string, 
  userName: string,
  filters?: {
    page?: number;
    limit?: number;
    search?: string;
    company?: string;
    minScore?: number;
    maxScore?: number;
    startDate?: string;
    endDate?: string;
  }
) {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.company) params.append('company', filters.company);
  if (filters?.minScore) params.append('min_score', filters.minScore.toString());
  if (filters?.maxScore) params.append('max_score', filters.maxScore.toString());
  if (filters?.startDate) params.append('start_date', filters.startDate);
  if (filters?.endDate) params.append('end_date', filters.endDate);

  const response = await fetch(`${API_BASE_URL}/resume-history?${params}`, {
    headers: {
      "X-User-ID": userId,
      "X-User-Email": userEmail,
      "X-User-Name": userName,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch resume history");
  return response.json();
}

export async function generatePDFFromHistory(generationId: string, userId: string, userEmail: string, userName: string, resumeTemplate: string = "resume_template_7.html") {
  const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": userId,
      "X-User-Email": userEmail,
      "X-User-Name": userName,
    },
    body: JSON.stringify({ 
      resume_generation_id: generationId,
      resume_template: resumeTemplate 
    }),
  });

  if (!response.ok) throw new Error("Failed to generate PDF");
  return response.json();
}