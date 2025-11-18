import type { Attribute, Schema } from '@strapi/strapi';

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'seo';
  };
  attributes: {
    keywords: Attribute.String;
    metaDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogImage: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedSocialLinks extends Schema.Component {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media links';
    displayName: 'Social Links';
  };
  attributes: {
    platform: Attribute.Enumeration<
      ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube']
    >;
    url: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.seo': SharedSeo;
      'shared.social-links': SharedSocialLinks;
    }
  }
}
