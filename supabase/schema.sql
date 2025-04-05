-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if stats table exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'stats') THEN
    CREATE TABLE stats (
      id SERIAL PRIMARY KEY,
      blog_count INTEGER DEFAULT 0,
      page_views INTEGER DEFAULT 0,
      projects_count INTEGER DEFAULT 0,
      github_stars INTEGER DEFAULT 0,
      current_project TEXT,
      current_stack TEXT
    );
    
    -- Insert initial stats
    INSERT INTO stats (id, blog_count, page_views, projects_count, github_stars, current_project, current_stack)
    VALUES (1, 3, 1024, 5, 87, 'Personal Portfolio', 'Next.js, Supabase, Tailwind CSS');
  ELSE
    -- If stats table exists, add new columns if they don't exist
    BEGIN
      ALTER TABLE stats ADD COLUMN IF NOT EXISTS current_project TEXT;
      ALTER TABLE stats ADD COLUMN IF NOT EXISTS current_stack TEXT;
      
      -- Update stats with current project info if it exists
      UPDATE stats 
      SET 
        current_project = COALESCE(current_project, 'Personal Portfolio'),
        current_stack = COALESCE(current_stack, 'Next.js, Supabase, Tailwind CSS')
      WHERE id = 1;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Error updating stats table: %', SQLERRM;
    END;
  END IF;
END
$$;

-- Create blogs table if it doesn't exist
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery_albums table
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery_images table with foreign key to gallery_albums
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gallery_images_album_id_fkey'
  ) THEN
    ALTER TABLE gallery_images 
    ADD CONSTRAINT gallery_images_album_id_fkey 
    FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error adding foreign key constraint: %', SQLERRM;
END
$$;

-- Create timeline_posts table
CREATE TABLE IF NOT EXISTS timeline_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create github_repos table if it doesn't exist
CREATE TABLE IF NOT EXISTS github_repos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  stars INTEGER DEFAULT 0,
  language TEXT
);

-- Create github_commits table
CREATE TABLE IF NOT EXISTS github_commits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  repo TEXT NOT NULL,
  commit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to increment page views if it doesn't exist
CREATE OR REPLACE FUNCTION increment_page_view()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_views INTEGER;
BEGIN
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
  
  RETURN current_views;
END;
$$;

-- Insert sample data only if tables are empty
-- Sample blog posts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM blogs LIMIT 1) THEN
    INSERT INTO blogs (title, description, created_at) VALUES
    ('Building React Native Apps with TypeScript', 'Learn how to leverage TypeScript in your React Native projects for better type safety and developer experience.', NOW() - INTERVAL '2 days'),
    ('Optimizing Mobile App Performance', 'Techniques and strategies to make your mobile applications faster and more responsive.', NOW() - INTERVAL '7 days'),
    ('Integrating Payment Gateways in Nepal', 'A comprehensive guide to implementing Esewa and Khalti payment systems in your applications.', NOW() - INTERVAL '14 days');
  END IF;
END
$$;

-- Sample gallery albums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM gallery_albums LIMIT 1) THEN
    INSERT INTO gallery_albums (title, description, cover_image) VALUES
    ('Hiking Adventures', 'Photos from my hiking trips', '/placeholder.svg?height=200&width=400'),
    ('Work Events', 'Team building and office activities', '/placeholder.svg?height=200&width=400'),
    ('Travel Memories', 'Places I have visited', '/placeholder.svg?height=200&width=400');
  END IF;
END
$$;

-- Sample gallery images (only insert if albums exist and no images exist)
DO $$
DECLARE
  hiking_id UUID;
  work_id UUID;
  travel_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM gallery_images LIMIT 1) THEN
    SELECT id INTO hiking_id FROM gallery_albums WHERE title = 'Hiking Adventures' LIMIT 1;
    SELECT id INTO work_id FROM gallery_albums WHERE title = 'Work Events' LIMIT 1;
    SELECT id INTO travel_id FROM gallery_albums WHERE title = 'Travel Memories' LIMIT 1;
    
    IF hiking_id IS NOT NULL THEN
      INSERT INTO gallery_images (album_id, image_url, caption) VALUES
      (hiking_id, '/placeholder.svg?height=400&width=600', 'Mountain view'),
      (hiking_id, '/placeholder.svg?height=400&width=600', 'Forest trail');
    END IF;
    
    IF work_id IS NOT NULL THEN
      INSERT INTO gallery_images (album_id, image_url, caption) VALUES
      (work_id, '/placeholder.svg?height=400&width=600', 'Team lunch'),
      (work_id, '/placeholder.svg?height=400&width=600', 'Coding session');
    END IF;
    
    IF travel_id IS NOT NULL THEN
      INSERT INTO gallery_images (album_id, image_url, caption) VALUES
      (travel_id, '/placeholder.svg?height=400&width=600', 'Pokhara lake'),
      (travel_id, '/placeholder.svg?height=400&width=600', 'Kathmandu durbar square');
    END IF;
  END IF;
END
$$;

-- Sample timeline posts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM timeline_posts LIMIT 1) THEN
    INSERT INTO timeline_posts (content, image_url, created_at) VALUES
    ('Started working on a new React Native project today!', NULL, NOW() - INTERVAL '2 days'),
    ('Beautiful sunset from my office window', '/placeholder.svg?height=400&width=600', NOW() - INTERVAL '5 days'),
    ('Just completed the payment integration for our app. Excited to see it in production!', NULL, NOW() - INTERVAL '10 days'),
    ('Team building event at the office', '/placeholder.svg?height=400&width=600', NOW() - INTERVAL '15 days');
  END IF;
END
$$;

-- Sample bookmarks
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM bookmarks LIMIT 1) THEN
    INSERT INTO bookmarks (title, url, description) VALUES
    ('React Native Documentation', 'https://reactnative.dev/docs/getting-started', 'Official React Native documentation'),
    ('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'Comprehensive guide to TypeScript'),
    ('Expo Documentation', 'https://docs.expo.dev/', 'Learn about Expo for React Native development'),
    ('Firebase Guides', 'https://firebase.google.com/docs/guides', 'Tutorials for implementing Firebase features');
  END IF;
END
$$;

-- Sample GitHub repos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM github_repos LIMIT 1) THEN
    INSERT INTO github_repos (name, description, url, stars, language) VALUES
    ('react-native-boilerplate', 'A starter template for React Native projects with TypeScript', 'https://github.com/sagarkhanal07/react-native-boilerplate', 42, 'TypeScript'),
    ('nepali-date-picker', 'A date picker component for Nepali calendar (Bikram Sambat)', 'https://github.com/sagarkhanal07/nepali-date-picker', 28, 'JavaScript'),
    ('payment-gateway-nepal', 'Integration libraries for Nepali payment gateways', 'https://github.com/sagarkhanal07/payment-gateway-nepal', 17, 'TypeScript');
  END IF;
END
$$;

-- Sample GitHub commits
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM github_commits LIMIT 1) THEN
    INSERT INTO github_commits (message, repo, commit_date) VALUES
    ('Fix navigation bug in profile screen', 'personal-portfolio', NOW() - INTERVAL '1 day'),
    ('Add dark mode support', 'personal-portfolio', NOW() - INTERVAL '2 days'),
    ('Implement Supabase integration', 'personal-portfolio', NOW() - INTERVAL '3 days'),
    ('Initial commit', 'personal-portfolio', NOW() - INTERVAL '5 days');
  END IF;
END
$$;

