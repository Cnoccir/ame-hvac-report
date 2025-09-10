# AME Inc. HVAC Service Report Application

## File Upload Requirements

This application relies on external files that need to be uploaded to your S3 bucket or similar storage. Below is a comprehensive list of all required files and their organization.

### Directory Structure

```
ame-techassist-bucket/
├── ame-report-images/
│   ├── ame-logo.png
│   ├── favicon.ico
│   ├── CliftonHS.png
│   ├── Clifton Stadium Weight Room.png
│   ├── CliftonPS1.png
│   ├── CliftonPS3.png
│   ├── CliftonPS4.png
│   ├── CliftonPS5.png
│   ├── CliftonPS9.png
│   ├── CliftonPS11.png
│   ├── CliftonPS14.png
│   ├── CliftonPS17.png
│   └── CliftonELA.png
│
├── service-reports/
│   ├── 211664-13788-PS17.pdf
│   ├── 210965-12939-ELA.pdf
│   ├── 210972-12946-ELA.pdf
│   ├── 210966-12940-CHS.pdf
│   ├── 210955-12929-CHS.pdf
│   ├── 210973-12947-CHS.pdf
│   ├── 210956-12930-CSWR.pdf
│   ├── 210967-12941-CSWR.pdf
│   ├── 210960-12934-PS1.pdf
│   ├── 210978-12952-PS1.pdf
│   ├── 210964-12938-PS3.pdf
│   ├── 210993-12967-PS3.pdf
│   ├── 210958-12932-PS4.pdf
│   ├── 210976-12950-PS4.pdf
│   ├── 210959-12933-PS5.pdf
│   ├── 210977-12951-PS5.pdf
│   ├── 210996-12970-PS5.pdf
│   ├── 210961-12935-PS9.pdf
│   ├── 210979-12953-PS9.pdf
│   ├── 210957-12931-PS11.pdf
│   ├── 210968-12942-PS11.pdf
│   ├── 210975-12949-PS11.pdf
│   ├── 210962-12936-PS14.pdf
│   ├── 210969-12943-PS14.pdf
│   └── 210991-12965-PS14.pdf
│
└── documentation/
    ├── ame-system-manual.pdf
    └── ame-maintenance-guide.pdf
```

### File Details

#### School Images (PNG files)
- School images should be 800x600 pixels
- Use consistent lighting and angle for all school photos
- Name format should match exactly as specified in the directory structure

#### Service Reports (PDF files)
- Original service ticket PDFs
- Named with the format: `{JOB_NUMBER}-{SCHOOL_CODE}.pdf`
- Each PDF contains the complete service report for one visit

#### Documentation
- Company logo: AME logo in PNG format
- Favicon: 16x16 and 32x32 pixel versions in ICO format
- System Manual: Comprehensive guide to the HVAC systems
- Maintenance Guide: Instructions for regular maintenance procedures

### Link Configuration

All file paths are configured in the `utils/linkConfig.js` file. If you change the directory structure or file names, update this configuration file accordingly.

## Implementation Notes

- All S3 bucket paths assume public read access to files
- For production environments, consider using signed URLs for reports
- Update the `BASE_URLS` object in `linkConfig.js` if your storage location changes

## Creating PDFs from Original Service Tickets

1. Scan original service tickets at 300 DPI
2. Save as PDF with the job number in the filename
3. Ensure all PDFs are searchable (OCR processing recommended)
4. Upload to the service-reports directory

## Serving Files

These files can be served from:
1. Amazon S3 bucket (current configuration)
2. Azure Blob Storage
3. Google Cloud Storage
4. Local server storage (for development)

To change the storage location, modify the `BASE_URLS` in the `linkConfig.js` file.

---

## Print/PDF Export (Branded, Vercel-ready)

This project includes a print-optimized route and a PDF export API that renders the entire multi-section report as a branded PDF suitable for bids and executive review.

Features:
- `/print?id=...` flattens all sections into a single page sequence with page breaks.
- Static Google Map image via Static Maps API.
- Print-safe inline charts (SVG) for metrics.
- Serverless Chromium on Vercel to generate PDFs.

Environment variables:
- `NEXT_PUBLIC_BASE_URL` – Your deployed base URL (e.g. `https://ame-hvac-report.vercel.app`). Used by the PDF API to render the print page.
- `GOOGLE_MAPS_API_KEY` – Google Static Maps key for the map image.
- `NEXT_PUBLIC_PDF_EXPORT` – Optional. Set to `true` to show the "Download PDF" button in the UI.

Local test steps:
1. Install deps: `npm i`
2. Run dev: `npm run dev`
3. Visit: `http://localhost:3000/print?id=demo`
4. Test PDF: `http://localhost:3000/api/export/pdf?id=demo`
   - If `NEXT_PUBLIC_BASE_URL` is not set, the API will fall back to the current host.

Deployment notes (Vercel):
- Add `NEXT_PUBLIC_BASE_URL` and `GOOGLE_MAPS_API_KEY` in your Vercel Project > Settings > Environment Variables.
- The API route uses `@sparticuz/chromium` + `puppeteer-core` in serverless.
- For local development, a dev dependency on `puppeteer` is used automatically.
