import { getBlogs } from "@/lib/supabase";
import BlogsTab from "@/components/tabs/blogs-tab";

// This is a server component
export default async function BlogsPage() {
  const blogs = await getBlogs();
  return <BlogsTab blogs={blogs} />;
}
