# AME Inc. HVAC Service Report

A React-based dashboard for visualizing HVAC service data from Clifton Public Schools.

## Overview

This dashboard provides a comprehensive view of HVAC maintenance services performed at Clifton Public Schools from March-April 2025. It includes:

- Executive Summary with key metrics and findings
- Geographic Service Distribution Map
- Service Metrics Overview (charts and tables)
- Service Visit Timeline
- Analysis of Recurring Issues
- Detailed Visit Logs by School

## Technology Stack

- Next.js - React framework
- Recharts - For data visualization
- Lucide React - For icons
- Tailwind CSS - For styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/YOUR-USERNAME/ame-hvac-report.git
   ```

2. Install dependencies
   ```
   cd ame-hvac-report
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

The project is configured for easy deployment on Vercel:

1. Push the repository to GitHub
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Deploy

## Project Structure

- `/pages` - Next.js pages
- `/styles` - CSS styles
- `/public` - Static assets

## Image Hosting

All school images and map data are hosted on AWS S3 at:
`s3://ame-techassist-bucket/ame-report-images/`

## License

© 2025 AME Inc. All Rights Reserved.
