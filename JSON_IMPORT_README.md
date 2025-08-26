# JSON Blog Import Feature

The FitFlix Admin Dashboard now supports automatic blog creation from JSON files. This feature allows you to bulk import blogs by simply dragging and dropping a JSON file.

## How to Use

1. **Navigate to Blog Management** in the admin dashboard
2. **Click "Import JSON"** button to show the import zone
3. **Drag and drop** a JSON file onto the import zone, or **click "Browse Files"** to select a file
4. The system will automatically process the JSON and create blogs

## Supported JSON Formats

### 1. Array of Blog Objects
```json
[
  {
    "title": "Blog Title",
    "content": "# Markdown Content\n\nYour blog content here...",
    "excerpt": "Brief description",
    "status": "DRAFT",
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description",
    "metaKeywords": "keyword1, keyword2"
  }
]
```

### 2. Object with Blogs Array
```json
{
  "blogs": [
    {
      "title": "Blog Title",
      "content": "Content here...",
      "status": "PUBLISHED"
    }
  ]
}
```

### 3. Single Blog Object
```json
{
  "title": "Single Blog",
  "content": "Content here...",
  "status": "DRAFT"
}
```

## Required Fields

- **`title`** - Blog title (required)
- **`content`** - Blog content in Markdown format (required)

## Optional Fields

- **`excerpt`** - Blog excerpt/summary
- **`slug`** - URL slug (auto-generated from title if not provided)
- **`coverImage`** - Cover image URL
- **`status`** - Blog status: `DRAFT`, `PUBLISHED`, or `ARCHIVED` (defaults to `DRAFT`)
- **`metaTitle`** - SEO title
- **`metaDescription`** - SEO description
- **`metaKeywords`** - SEO keywords
- **`image`** - Alternative field name for cover image
- **`keywords`** - Alternative field name for meta keywords
- **`tags`** - Array of tags (will be converted to comma-separated keywords)

## Features

- **Automatic slug generation** from title if not provided
- **Auto-excerpt generation** from content if not provided
- **Flexible field mapping** - supports multiple field names
- **Bulk processing** - can import multiple blogs at once
- **Error handling** - continues processing even if individual blogs fail
- **Success feedback** - shows how many blogs were created
- **Markdown support** - full markdown content support

## Example Usage

1. Create a JSON file with your blog data
2. Use the sample file `sample-blog-import.json` as a reference
3. Drag and drop the file onto the import zone
4. Watch as blogs are automatically created
5. Check the success message to confirm import count

## Error Handling

- Invalid JSON format will show an error message
- Individual blog creation failures won't stop the entire import
- Each failed blog will show a specific error message
- The system will continue processing remaining blogs

## Tips

- Use `DRAFT` status for imported blogs to review before publishing
- Include SEO metadata for better search engine optimization
- Use markdown formatting in content for rich text display
- Test with a small JSON file first before bulk importing
