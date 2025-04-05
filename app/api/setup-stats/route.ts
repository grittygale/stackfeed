import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create the stats table and increment_page_view function
    const { error } = await supabase.rpc("setup_stats_table")

    if (error) {
      // If the rpc doesn't exist, create the table directly
      const createTableResult = await supabase.sql`
        -- Enable UUID extension if not already enabled
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
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
        VALUES (1, 3, 1024, 5, 87, 'Personal Portfolio', 'Next.js, Supabase, Tailwind CSS')
        ON CONFLICT (id) DO NOTHING;
        
        -- Create function to increment page views
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
      `

      return NextResponse.json({
        message: "Stats table and function created successfully",
        result: createTableResult,
      })
    }

    return NextResponse.json({ message: "Setup completed successfully" })
  } catch (error) {
    console.error("Error setting up stats table:", error)
    return NextResponse.json({ error: "Failed to set up stats table" }, { status: 500 })
  }
}

