
export type ComponentType =
  // Common
  | 'header' | 'footer' | 'hero' | 'text' | 'button' | 'image' | 'video' | 'customHtml' | 'features' | 'testimonials'
  // Website specific
  | 'pricing' | 'faq' | 'contact'
  // Blog specific (future)
  | 'author' | 'tags' | 'relatedPosts'
  // Newsletter specific (future)
  | 'countdown' | 'socials' | 'optinForm';


export interface Component {
  id: number;
  type: ComponentType;
  content: any;
}
