/*
  # Create resume generations table

  1. New Tables
    - `resume_generations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `original_filename` (text) - name of the uploaded resume file
      - `ats_score` (numeric) - the ATS compatibility score
      - `resume_template` (text) - template used for generation
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `jobs`
      - `id` (uuid, primary key)
      - `resume_generation_id` (uuid, foreign key to resume_generations)
      - `title` (text) - job title
      - `company` (text) - company name
      - `description` (text) - job description
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create resume_generations table
CREATE TABLE IF NOT EXISTS resume_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_filename text NOT NULL,
  ats_score numeric(5,2) DEFAULT 0,
  resume_template text DEFAULT 'resume_template_7.html',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_generation_id uuid NOT NULL REFERENCES resume_generations(id) ON DELETE CASCADE,
  title text,
  company text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE resume_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for resume_generations
CREATE POLICY "Users can read own resume generations"
  ON resume_generations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own resume generations"
  ON resume_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own resume generations"
  ON resume_generations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own resume generations"
  ON resume_generations
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for jobs
CREATE POLICY "Users can read jobs for their resume generations"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (
    resume_generation_id IN (
      SELECT id FROM resume_generations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert jobs for their resume generations"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    resume_generation_id IN (
      SELECT id FROM resume_generations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update jobs for their resume generations"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (
    resume_generation_id IN (
      SELECT id FROM resume_generations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete jobs for their resume generations"
  ON jobs
  FOR DELETE
  TO authenticated
  USING (
    resume_generation_id IN (
      SELECT id FROM resume_generations WHERE user_id = auth.uid()
    )
  );

-- Create trigger for resume_generations updated_at
CREATE TRIGGER resume_generations_updated_at
  BEFORE UPDATE ON resume_generations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resume_generations_user_id ON resume_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_generations_created_at ON resume_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_resume_generation_id ON jobs(resume_generation_id);