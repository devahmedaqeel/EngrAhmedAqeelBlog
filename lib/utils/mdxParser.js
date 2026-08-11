import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

// mdx content parser
const parseMDX = async (content) => {
  const options = {
    mdxOptions: {
      rehypePlugins: [rehypeSlug],
      remarkPlugins: [remarkGfm],
    },
  };
  try {
    return await serialize(content, options);
  } catch (err) {
    console.warn("MDX parse warning, trying plain serialize fallback:", err.message);
    try {
      return await serialize(content);
    } catch (fallbackErr) {
      return await serialize(String(content || ""));
    }
  }
};

export default parseMDX;
