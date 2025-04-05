-- Function to create stats table if it doesn't exist
CREATE OR REPLACE FUNCTION create_stats_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
  INSERT INTO stats (id, blog_count, page_views, projects_count, github_stars)
  VALUES (1, 0, 0, 0, 0)
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Function to create page_views_log table if it doesn't exist
CREATE OR REPLACE FUNCTION create_page_views_log_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
END;
$$;

-- Function to get incremented page views
CREATE OR REPLACE FUNCTION get_incremented_page_views()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_views INTEGER;
BEGIN
  -- Get current page views
  SELECT page_views INTO current_views FROM stats WHERE id = 1;
  
  -- Return incremented value
  RETURN COALESCE(current_views, 0) + 1;
END;
$$;

