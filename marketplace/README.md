# Runic CMS Marketplace

The Runic CMS Marketplace allows users to share and download:
- **Templates** - Complete site designs
- **Elements** - Custom content object types
- **Plugins** - Extended functionality
- **Themes** - Color schemes and styling

## For Users

### Browsing the Marketplace

Access the marketplace from your admin dashboard at `/admin/marketplace`

### Installing Items

1. Browse available items
2. Click "Install" on desired item
3. Item will be downloaded and installed automatically
4. Restart your CMS to activate

### Creating Your Own Items

See the [Developer Guide](./DEVELOPER_GUIDE.md) for creating marketplace items.

## For Developers

### Creating Marketplace Items

Each marketplace item must include:

1. **manifest.json** - Item metadata
2. **README.md** - Documentation
3. **preview/** - Screenshots/images
4. **src/** - Source code

### Manifest Structure

```json
{
  "name": "item-name",
  "displayName": "Beautiful Template",
  "version": "1.0.0",
  "type": "template|element|plugin|theme",
  "description": "A brief description",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://yoursite.com"
  },
  "license": "MIT",
  "repository": "https://github.com/you/item",
  "tags": ["minimal", "blog", "portfolio"],
  "compatibility": {
    "runicVersion": ">=1.0.0"
  },
  "dependencies": {},
  "preview": [
    "preview/screenshot1.png",
    "preview/screenshot2.png"
  ]
}
```

### Item Types

#### Templates
Complete site configurations with pages, styling, and content examples.

Structure:
```
my-template/
├── manifest.json
├── README.md
├── preview/
│   ├── screenshot1.png
│   └── screenshot2.png
└── template/
    ├── pages/
    ├── config.json
    └── styles.css
```

#### Elements
Custom content object types that extend the page builder.

Structure:
```
my-element/
├── manifest.json
├── README.md
├── preview/
│   └── preview.png
└── src/
    ├── component.tsx
    ├── schema.ts
    └── icon.svg
```

#### Plugins
Extended functionality for the CMS.

Structure:
```
my-plugin/
├── manifest.json
├── README.md
├── preview/
│   └── preview.png
└── src/
    ├── index.ts
    ├── api/
    └── components/
```

#### Themes
Pre-configured color schemes and styling.

Structure:
```
my-theme/
├── manifest.json
├── README.md
├── preview/
│   └── preview.png
└── theme/
    ├── colors.json
    ├── typography.json
    └── styles.css
```

### Submission Process

1. **Prepare your item** following the structure above
2. **Test thoroughly** with a fresh Runic CMS installation
3. **Create a GitHub repository** for your item
4. **Submit via marketplace portal** at marketplace.runic-cms.com
5. **Wait for review** (usually 24-48 hours)
6. **Address feedback** if requested
7. **Publication** once approved

### Moderation Guidelines

Items must:
- ✓ Be properly documented
- ✓ Follow security best practices
- ✓ Not contain malicious code
- ✓ Respect user privacy
- ✓ Include appropriate licensing
- ✓ Have clear preview images
- ✓ Work as described

Items will be rejected if they:
- ✗ Contain malware or tracking
- ✗ Violate copyrights
- ✗ Have misleading descriptions
- ✗ Lack proper documentation
- ✗ Don't work as advertised

## Marketplace API

### For the Main Marketplace Server

The marketplace server provides these endpoints:

```
GET  /api/items - List all approved items
GET  /api/items/:id - Get specific item details
GET  /api/items/search?q=query - Search items
POST /api/items - Submit new item (requires auth)
PUT  /api/items/:id - Update item (requires auth)
GET  /api/items/:id/download - Download item package
POST /api/items/:id/review - Submit review
GET  /api/items/:id/reviews - Get reviews
```

### For CMS Installations

CMS installations communicate with the marketplace to:
- Browse available items
- Download and install items
- Check for updates
- Submit reviews

## Revenue Sharing

### Free Items
- Completely free to download and use
- Great for building reputation
- Can include donation links

### Paid Items
- Set your own price ($1 - $999)
- Revenue split: 70% author, 30% platform
- Monthly payouts via PayPal/Stripe
- Must provide support for paid items

## Support & Community

- **Discord**: discord.gg/runic-cms
- **Forum**: community.runic-cms.com
- **Email**: marketplace@runic-cms.com

## License

Marketplace platform code is licensed under MIT.
Individual items have their own licenses as specified by authors.
