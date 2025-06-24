
export type ComponentType =
  // Common
  | 'header' | 'footer' | 'hero' | 'text' | 'button' | 'image' | 'video' | 'customHtml' | 'features' | 'testimonials'
  // Website specific
  | 'pricing' | 'faq' | 'contact'
  // Blog specific
  | 'authorBox'
  // Newsletter specific
  | 'countdown' | 'socials' | 'optinForm';


export interface Component {
  id: number;
  type: ComponentType;
  content: any;
}
