const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function optimizeResume({ resume, jobdesc }: { resume: File; jobdesc: string }) {
  const formData = new FormData();
  formData.append("resume_pdf", resume);
  formData.append("jobdesc_text", jobdesc);

  const response = await fetch(`${API_BASE_URL}/optimize_resume/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to optimize resume");
  }

  // Parse JSON response to get download URL and feedback
  const result = await response.json();
  return result;
}

export async function downloadOptimizedResume(downloadUrl: string) {
  console.log("Downloading optimized resume from:", downloadUrl);
  const response = await fetch(`${API_BASE_URL}${downloadUrl}`);
  if (!response.ok) throw new Error("Failed to download optimized resume");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "optimized_resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
