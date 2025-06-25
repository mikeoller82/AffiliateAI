
import { redirect } from 'next/navigation';

// In a real application, this data would come from a database.
const linkMap: { [key: string]: string } = {
  'product-hunt': 'https://www.producthunt.com',
  'google': 'https://www.google.com',
  // You would dynamically add user-created slugs here
};

export default function AffiliateLinkPage({ params }: { params: { slug: string } }) {
  // In a real app, you would:
  // 1. Look up params.slug in your database.
  // 2. Increment a click count for analytics.
  // 3. Redirect to the targetUrl.
  
  const destinationUrl = linkMap[params.slug];

  if (destinationUrl) {
    redirect(destinationUrl);
  } else {
    // Redirect to a 404 page or the home page if the slug doesn't exist.
    redirect('/');
  }
}
