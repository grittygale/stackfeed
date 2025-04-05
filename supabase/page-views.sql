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

-- Make sure stats table has the required columns
ALTER TABLE stats 
ADD COLUMN IF NOT EXISTS current_project TEXT,
ADD COLUMN IF NOT EXISTS current_stack TEXT;

-- Create or replace function to increment page view only once per visitor per day
CREATE OR REPLACE FUNCTION increment_unique_page_view(p_visitor_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_views INTEGER;
  today DATE := CURRENT_DATE;
BEGIN
  -- Check if this visitor has already been counted today
  IF NOT EXISTS (
    SELECT 1 FROM page_views_log 
    WHERE visitor_id = p_visitor_id AND visit_date = today
  ) THEN
    -- If no stats record exists, create one
    INSERT INTO stats (id, page_views)
    VALUES (1, 1)
    ON CONFLICT (id) DO
      UPDATE SET page_views = stats.page_views + 1
      RETURNING page_views INTO current_views;
    
    -- If the INSERT didn't return a value (because it did an UPDATE), get the current value
    IF current_views IS NULL THEN
      SELECT page_views INTO current_views FROM stats WHERE id = 1;
    END IF;
    
    -- Log the visit
    INSERT INTO page_views_log (visitor_id, visit_date)
    VALUES (p_visitor_id, today);
  ELSE
    -- Visitor already counted today, just return current count
    SELECT page_views INTO current_views FROM stats WHERE id = 1;
  END IF;
  
  RETURN current_views;
END;
$$;

