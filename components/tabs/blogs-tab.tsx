import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

// Define the Blog type
type Blog = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

// Client component that renders the UI
export default function BlogsTab({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No blogs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog: Blog) => (
        <Card key={blog.id} className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl">{blog.title}</CardTitle>
            <CardDescription>
              {formatDistanceToNow(new Date(blog.created_at), {
                addSuffix: true,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{blog.description}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
