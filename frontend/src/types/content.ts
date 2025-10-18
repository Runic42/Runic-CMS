// Content object types for the CMS

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export type ContentObjectType = 
  | 'gallery'
  | 'video'
  | 'text'
  | 'embed'
  | 'youtube'

export interface BaseContentObject {
  id: string
  type: ContentObjectType
  order: number
  deviceVisibility: {
    desktop: boolean
    tablet: boolean
    mobile: boolean
  }
}

export interface GalleryObject extends BaseContentObject {
  type: 'gallery'
  images: {
    url: string
    alt: string
    caption?: string
  }[]
  layout: 'grid' | 'carousel' | 'masonry'
  textPosition?: 'left' | 'right' | 'top' | 'bottom'
  text?: string
  responsive: {
    desktop: {
      columns: number
      gap: number
    }
    tablet: {
      columns: number
      gap: number
    }
    mobile: {
      columns: number
      gap: number
    }
  }
}

export interface VideoObject extends BaseContentObject {
  type: 'video'
  url: string
  poster?: string
  autoplay: boolean
  loop: boolean
  muted: boolean
  controls: boolean
}

export interface TextObject extends BaseContentObject {
  type: 'text'
  content: string
  styling: {
    fontSize: number
    fontWeight: string
    color: string
    alignment: 'left' | 'center' | 'right' | 'justify'
    padding: {
      top: number
      right: number
      bottom: number
      left: number
    }
  }
}

export interface EmbedObject extends BaseContentObject {
  type: 'embed'
  embedCode: string
  height?: number
  width?: number
}

export interface YouTubeObject extends BaseContentObject {
  type: 'youtube'
  videoId: string
  autoplay: boolean
  controls: boolean
  startTime?: number
}

export type ContentObject = 
  | GalleryObject
  | VideoObject
  | TextObject
  | EmbedObject
  | YouTubeObject

export interface Page {
  id: string
  title: string
  slug: string
  content: ContentObject[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface SiteConfig {
  id: string
  siteName: string
  logo?: string
  favicon?: string
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
  }
  navigation: {
    items: {
      label: string
      url: string
      order: number
    }[]
  }
  footer: {
    text: string
    links: {
      label: string
      url: string
    }[]
  }
}
