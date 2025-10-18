# Runic CMS Marketplace - Developer Guide

Complete guide for creating and publishing marketplace items.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Templates](#creating-templates)
3. [Creating Elements](#creating-elements)
4. [Creating Plugins](#creating-plugins)
5. [Creating Themes](#creating-themes)
6. [Testing Your Item](#testing-your-item)
7. [Publishing](#publishing)

## Getting Started

### Prerequisites

- Node.js 18+
- Runic CMS installed locally
- Basic knowledge of React/TypeScript
- GitHub account

### Initialize Your Item

```bash
# Clone the item starter template
git clone https://github.com/runic-cms/item-starter my-item
cd my-item

# Install dependencies
npm install

# Start development
npm run dev
```

## Creating Templates

Templates are complete site configurations.

### Template Structure

```
my-template/
├── manifest.json
├── README.md
├── preview/
│   ├── desktop.png
│   ├── tablet.png
│   └── mobile.png
├── template/
│   ├── pages/
│   │   ├── home.json
│   │   ├── about.json
│   │   └── contact.json
│   ├── config.json
│   ├── navigation.json
│   └── styles.css
└── assets/
    └── images/
```

### manifest.json Example

```json
{
  "name": "minimal-blog",
  "displayName": "Minimal Blog Template",
  "version": "1.0.0",
  "type": "template",
  "description": "A clean, minimal blog template perfect for writers",
  "author": {
    "name": "Jane Developer",
    "email": "jane@example.com",
    "url": "https://janedeveloper.com"
  },
  "license": "MIT",
  "repository": "https://github.com/jane/minimal-blog",
  "tags": ["blog", "minimal", "writing"],
  "compatibility": {
    "runicVersion": ">=1.0.0"
  },
  "preview": [
    "preview/desktop.png",
    "preview/tablet.png",
    "preview/mobile.png"
  ],
  "demo": "https://demo.janedeveloper.com/minimal-blog"
}
```

### config.json

```json
{
  "siteName": "My Blog",
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#7c3aed",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter, sans-serif"
  },
  "navigation": {
    "items": [
      { "label": "Home", "url": "/", "order": 0 },
      { "label": "Blog", "url": "/blog", "order": 1 },
      { "label": "About", "url": "/about", "order": 2 }
    ]
  }
}
```

### Page JSON Format

```json
{
  "title": "Home",
  "slug": "home",
  "content": [
    {
      "id": "obj-1",
      "type": "text",
      "order": 0,
      "content": "<h1>Welcome to My Blog</h1>",
      "styling": {
        "fontSize": 48,
        "fontWeight": "bold",
        "color": "#1f2937",
        "alignment": "center"
      },
      "deviceVisibility": {
        "desktop": true,
        "tablet": true,
        "mobile": true
      }
    }
  ],
  "seo": {
    "title": "Home - My Blog",
    "description": "Welcome to my personal blog",
    "keywords": ["blog", "writing"]
  }
}
```

## Creating Elements

Elements are custom content objects for the page builder.

### Element Structure

```
my-element/
├── manifest.json
├── README.md
├── preview/
│   └── preview.gif
└── src/
    ├── index.ts
    ├── Component.tsx
    ├── Editor.tsx
    ├── schema.ts
    └── icon.svg
```

### Example: Pricing Table Element

**schema.ts:**
```typescript
export interface PricingTableObject extends BaseContentObject {
  type: 'pricing-table'
  plans: {
    name: string
    price: string
    features: string[]
    highlighted: boolean
  }[]
  currency: string
}
```

**Component.tsx:**
```typescript
import React from 'react'
import { PricingTableObject } from './schema'

export function PricingTable({ data }: { data: PricingTableObject }) {
  return (
    <div className="pricing-table grid grid-cols-3 gap-6">
      {data.plans.map((plan, idx) => (
        <div
          key={idx}
          className={`pricing-plan p-6 rounded-lg border-2 ${
            plan.highlighted ? 'border-blue-500 shadow-xl' : 'border-gray-200'
          }`}
        >
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className="text-4xl font-bold my-4">
            {data.currency}{plan.price}
          </div>
          <ul className="space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i}>✓ {feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

**Editor.tsx:**
```typescript
export function PricingTableEditor({ data, onChange }: EditorProps) {
  // Editor component for admin interface
  return (
    <div>
      {/* Edit interface for pricing plans */}
    </div>
  )
}
```

**index.ts:**
```typescript
import { PricingTable } from './Component'
import { PricingTableEditor } from './Editor'
import icon from './icon.svg'

export default {
  type: 'pricing-table',
  displayName: 'Pricing Table',
  icon,
  Component: PricingTable,
  Editor: PricingTableEditor,
  defaultProps: {
    plans: [],
    currency: '$'
  }
}
```

## Creating Plugins

Plugins extend CMS functionality.

### Plugin Structure

```
my-plugin/
├── manifest.json
├── README.md
├── preview/
│   └── preview.png
└── src/
    ├── index.ts
    ├── api/
    │   └── routes.ts
    ├── components/
    │   └── Dashboard.tsx
    └── hooks/
        └── usePlugin.ts
```

### Example: Analytics Plugin

**index.ts:**
```typescript
export default {
  name: 'analytics-plugin',
  version: '1.0.0',
  
  // Called when plugin is activated
  async activate(cms) {
    // Register API routes
    cms.registerRoutes(require('./api/routes'))
    
    // Add to admin menu
    cms.addMenuItem({
      label: 'Analytics',
      icon: '📊',
      path: '/admin/analytics',
      component: require('./components/Dashboard').default
    })
    
    // Hook into page views
    cms.on('pageView', (pageId) => {
      this.trackView(pageId)
    })
  },
  
  // Called when plugin is deactivated
  async deactivate(cms) {
    cms.removeRoutes('analytics-plugin')
    cms.removeMenuItem('Analytics')
  }
}
```

## Creating Themes

Themes are pre-configured styling sets.

### Theme Structure

```
my-theme/
├── manifest.json
├── README.md
├── preview/
│   └── colors.png
└── theme/
    ├── colors.json
    ├── typography.json
    ├── spacing.json
    └── custom.css
```

**colors.json:**
```json
{
  "primary": "#3b82f6",
  "secondary": "#8b5cf6",
  "accent": "#f59e0b",
  "background": "#ffffff",
  "surface": "#f9fafb",
  "text": {
    "primary": "#1f2937",
    "secondary": "#6b7280",
    "disabled": "#9ca3af"
  },
  "border": "#e5e7eb",
  "success": "#10b981",
  "warning": "#f59e0b",
  "error": "#ef4444"
}
```

**typography.json:**
```json
{
  "fontFamily": {
    "primary": "Inter, sans-serif",
    "heading": "Poppins, sans-serif",
    "mono": "Fira Code, monospace"
  },
  "fontSize": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem"
  },
  "fontWeight": {
    "light": 300,
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  }
}
```

## Testing Your Item

### Local Testing

1. **Install in development CMS:**
```bash
cd my-runic-cms
npm run marketplace:install ../my-item
```

2. **Test all features:**
- Installation process
- Configuration
- Functionality
- Responsive design
- Browser compatibility

3. **Test uninstallation:**
```bash
npm run marketplace:uninstall my-item
```

### Automated Testing

Create tests in your item:

```typescript
// __tests__/item.test.ts
import { renderElement } from '@runic/testing'
import MyElement from '../src'

describe('My Element', () => {
  it('renders correctly', () => {
    const result = renderElement(MyElement, {
      /* props */
    })
    expect(result).toMatchSnapshot()
  })
})
```

## Publishing

### Pre-Publication Checklist

- [ ] All files included and properly structured
- [ ] manifest.json is complete and valid
- [ ] README.md with clear documentation
- [ ] High-quality preview images
- [ ] Tested on fresh CMS installation
- [ ] No console errors or warnings
- [ ] Responsive on all device sizes
- [ ] Compatible with stated Runic version
- [ ] License file included
- [ ] Repository is public (if open source)

### Submission Process

1. **Prepare package:**
```bash
npm run build
npm run package
```

2. **Create GitHub release:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

3. **Submit to marketplace:**
- Go to marketplace.runic-cms.com
- Click "Submit Item"
- Fill in details and upload package
- Wait for review

### After Publication

- Monitor reviews and ratings
- Respond to user feedback
- Release updates for bugs/features
- Provide support via GitHub issues

## Best Practices

### Code Quality
- Use TypeScript for type safety
- Follow ESLint rules
- Write clear comments
- Handle errors gracefully

### Performance
- Optimize images (WebP format)
- Lazy load components
- Minimize bundle size
- Avoid unnecessary re-renders

### Security
- Sanitize user input
- Validate all data
- No hardcoded credentials
- Follow OWASP guidelines

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader support

### Documentation
- Clear installation instructions
- Usage examples
- API documentation
- Troubleshooting guide

## Support

Need help? Reach out:
- **Discord**: discord.gg/runic-cms-dev
- **Forum**: community.runic-cms.com/developers
- **Email**: dev@runic-cms.com

## Resources

- [API Reference](https://docs.runic-cms.com/api)
- [Component Library](https://docs.runic-cms.com/components)
- [Example Items](https://github.com/runic-cms/examples)
- [Starter Templates](https://github.com/runic-cms/starters)
