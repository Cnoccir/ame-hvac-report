# AME Inc. HVAC Report Styling Guide

This document provides guidelines for maintaining the visual styling of the AME Inc. HVAC Report application.

## Color Palette

The application uses a professional color palette that aligns with the AME Inc. brand identity:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Navy Blue  | `#1D0F5A` | Primary brand color, used for header/footer backgrounds |
| Subtle Red | `#E83A3A` | Primary accent color, used for highlights and important data |
| Blue       | `#3A6EE8` | Secondary accent color, used for medium-priority elements |
| Light Blue | `#6AAFE8` | Tertiary accent color, used for low-priority elements |
| Black      | `#000000` | Used for main text content |
| Dark Gray  | `#777777` | Used for secondary text content |
| Medium Gray| `#DDDDDD` | Used for borders and dividers |
| Light Gray | `#F2F2F2` | Used for background elements |

## CSS Variables

The application uses CSS variables for consistent application of the color palette. These are defined in `styles/globals.css`:

```css
:root {
  --color-navy: #1D0F5A;
  --color-red: #E83A3A;
  --color-accent: #3A6EE8;
  --color-gray: #666666;
  --color-light-gray: #F2F2F2;
  --color-medium-gray: #DDDDDD;
  --color-dark-gray: #777777;
}
```

## Constants in JavaScript

For components that require inline styling or configurations, the colors are also defined as constants in `pages/index.js`:

```javascript
const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  lightGrey: "#F2F2F2",
  mediumGrey: "#DDDDDD",
  darkGrey: "#777777",
  red: "#E83A3A",       // Subtle red accent color
  navy: "#1D0F5A",      // Navy blue from logo
  blue: "#3A6EE8",      // Blue accent that complements the navy
  lightBlue: "#6AAFE8", // Lighter blue for tertiary elements
  gray: "#666666"       // Gray for secondary text
}
```

## Chart Color Usage

When creating charts and visualizations, follow these guidelines:

1. **Bar Charts**: Use `COLORS.red` as the primary fill color
2. **Line Charts**: Use `COLORS.red` for the stroke color
3. **Heat Maps**: Use varying opacity of `COLORS.red` to indicate intensity
4. **Priority Indicators**:
   - High Priority: `COLORS.red`
   - Medium Priority: `COLORS.blue`
   - Low Priority: `COLORS.lightBlue` or `COLORS.lightGrey`

## Map Marker Colors

The map uses a color-coding system based on service hours:

1. **High Hours (16+ hrs)**: `#E83A3A` (red)
2. **Medium Hours (8-15 hrs)**: `#3A6EE8` (blue)
3. **Low Hours (1-7 hrs)**: `#6AAFE8` (light blue)

## Responsive Design

The application includes responsive design considerations for different screen sizes:

- Use `md:` prefix for medium screens and larger
- Use base classes for mobile-first approach
- Example: `class="text-xs md:text-sm"` for text that should be extra small on mobile but small on desktop

## Adding New Components

When adding new components to the application:

1. Use the defined color palette and avoid introducing new colors
2. For charts, follow the chart color usage guidelines above
3. Use the CSS variables where possible, especially for theming elements
4. For inline styles, use the `COLORS` constant to maintain consistency

## Map Implementation

The current map implementation uses a static image with calculated positioning for markers. If you want to implement an interactive map:

1. Consider using Leaflet.js or Google Maps JavaScript API
2. Keep the same color scheme for markers
3. Ensure proper mobile responsiveness with appropriate zoom levels
4. Include popup information consistent with the current implementation

## Accessibility Considerations

When making styling changes, ensure:

1. Sufficient color contrast between text and background
2. Interactive elements have appropriate hover/focus states
3. Text is sized appropriately for readability (minimum 12px)
4. Critical information is not conveyed by color alone
