/**
 * Helmet utility for setting meta tags dynamically
 * Usage: Add this to your page components for better SEO
 */

export const getProductPageMeta = (product) => {
  return {
    title: `${product?.name} - Prime Wave Executive Shades`,
    description: product?.description?.substring(0, 160) || 'High-quality parking shade solution',
    keywords: `${product?.name}, parking shade, ${product?.category || 'parking solution'}`,
  };
};

export const getProjectPageMeta = (project) => {
  return {
    title: `${project?.title} - Prime Wave Executive Shades Projects`,
    description: project?.description?.substring(0, 160) || 'Professional parking shade project',
    keywords: `${project?.title}, ${project?.location}, parking project, installation`,
  };
};

export const getPageMeta = (page) => {
  const metaData = {
    home: {
      title: 'Prime Wave Executive Shades - Premium Parking & Privacy Solutions',
      description: 'Professional parking shades and privacy solutions. High-quality installation, excellent service.',
      keywords: 'parking shades, car shade, privacy solution, parking installation, UAE',
    },
    about: {
      title: 'About Prime Wave Executive Shades - Premium Quality & Service',
      description: 'Learn about Prime Wave Executive Shades - our commitment to quality, service, and customer satisfaction.',
      keywords: 'about parking shades, company values, installation services',
    },
    contact: {
      title: 'Contact Prime Wave Executive Shades - Get Your Shade Today',
      description: 'Contact us for parking shade inquiries, quotes, and professional installation services.',
      keywords: 'contact parking shades, quote, installation, inquiry',
    },
  };
  
  return metaData[page] || metaData.home;
};

/**
 * Structured Data for JSON-LD (Google Rich Snippets)
 */
export const getStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Prime Wave Executive Shades',
    description: 'Premium parking shades and privacy solutions',
    url: 'https://primewaveshades.works',
    logo: 'https://primewaveshades.works/logo.svg',
    image: 'https://primewaveshades.works/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+971-123-456789',
      contactType: 'Customer Service',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
    },
    sameAs: [
      'https://www.facebook.com/primewaveshades',
      'https://www.instagram.com/primewaveshades',
      'https://www.whatsapp.com',
    ],
  };
};
