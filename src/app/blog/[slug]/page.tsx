import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;
  redirect(`/insights/${slug}`);
}
