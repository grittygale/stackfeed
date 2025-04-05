-- Create stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  blog_count INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  projects_count INTEGER DEFAULT 0,
  github_stars INTEGER DEFAULT 0,
  current_project TEXT,
  current_stack TEXT
);

-- Insert initial stats if not exists
INSERT INTO stats (id, blog_count, page_views, projects_count, github_stars, current_project, current_stack)
VALUES (1, 0, 0, 0, 0, 'Personal Portfolio', 'Next.js, Supabase, Tailwind CSS')
ON CONFLICT (id) DO NOTHING;

-- Create page_views_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS page_views_log (
  id SERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  visit_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_views_log_visitor_date 
ON page_views_log(visitor_id, visit_date);

