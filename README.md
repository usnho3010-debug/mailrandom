# MailRandom

**Slogan:** Free Email & Web Tools for Everyone

MailRandom is a free browser-based email and web tools website. It is built with React, Vite, Tailwind CSS, and React Router. The project has no backend and no database. Tool input is processed locally in the user's browser whenever the tool can run client-side.

MailRandom là website cung cấp các công cụ email và web miễn phí chạy trực tiếp trên trình duyệt. Dự án được xây dựng bằng React, Vite, Tailwind CSS và React Router. Website không có backend, không có database và các công cụ xử lý dữ liệu trên trình duyệt người dùng khi có thể.

---

## Table of Contents

- [English Documentation](#english-documentation)
- [Tài Liệu Tiếng Việt](#tai-lieu-tieng-viet)
- [Required Commands](#required-commands)

---

# English Documentation

## 1. Introduction

MailRandom is a client-side web application that provides free email and web utilities for everyday productivity. It is designed for users who need quick tools without creating an account or uploading data to an application backend.

Available tools:

- Gmail Alias Generator
- Microsoft / Outlook Alias Generator
- Email Extractor Tool
- QR Code Generator
- Bulk URL Opener

Static pages included:

- Home
- About
- Contact
- Privacy Policy
- Terms and Conditions
- Disclaimer
- DMCA
- Sitemap
- 404 Not Found

## 2. Technology Stack

MailRandom uses:

- **React** for component-based UI.
- **Vite** for fast development and production builds.
- **Tailwind CSS** for responsive styling.
- **React Router** for client-side routing.
- **lucide-react** for icons.
- **jsPDF** for PDF export.
- **docx** for DOCX export.
- **mammoth** for reading DOCX files in the Email Extractor.
- **qr-code-styling** for styled QR code generation.

Project characteristics:

- No backend.
- No database.
- No account system.
- Browser-based processing.
- Responsive layout for mobile, tablet, and desktop.
- Static hosting friendly.

## 3. Requirements

Recommended environment:

- Node.js 20 or newer.
- npm 10 or newer.

Check your versions:

```bash
node -v
npm -v
```

## 4. Installation

Open a terminal in the project directory and install dependencies:

```bash
npm install
```

If dependencies are already installed, this command will make sure `node_modules` matches `package-lock.json`.

## 5. Run Locally

Start the Vite development server:

```bash
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173/
```

Open that URL in your browser.

## 6. Build for Production

Create an optimized static production build:

```bash
npm run build
```

The generated output will be placed in:

```text
dist/
```

Deploy the `dist` directory to any static hosting provider.

## 7. Preview Production Build

After building, preview the production build locally:

```bash
npm run preview
```

This serves the `dist` output locally so you can verify production behavior before deployment.

## 8. Project Structure

```text
src/
  components/
    Header.jsx
    Footer.jsx
    ToolCard.jsx
    Seo.jsx
    Layout.jsx
    ContentPage.jsx

  context/
    LanguageProvider.jsx
    languageStore.js
    useLanguage.js

  pages/
    Home.jsx
    About.jsx
    Contact.jsx
    PrivacyPolicy.jsx
    Terms.jsx
    Disclaimer.jsx
    Dmca.jsx
    Sitemap.jsx
    NotFound.jsx

  tools/
    GmailAliasGenerator.jsx
    MicrosoftAliasGenerator.jsx
    EmailExtractor.jsx
    QrCodeGenerator.jsx
    BulkUrlOpener.jsx

  utils/
    aliasUtils.js
    exportUtils.js
    emailExtractorUtils.js
    qrUtils.js
    urlUtils.js

  data/
    tools.js
    faq.js
    i18n.js
```

Important files:

- `src/App.jsx`: application routes.
- `src/main.jsx`: React entry point and providers.
- `src/index.css`: Tailwind import, theme tokens, global styles.
- `src/data/tools.js`: brand info, tool metadata, legal pages, route data.
- `src/data/i18n.js`: English and Vietnamese home/header/footer translations.
- `src/components/Seo.jsx`: dynamic document title and meta description.
- `vite.config.js`: Vite configuration.

## 9. Deploy to Vercel

### Option A: Deploy from Git Repository

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Log in to Vercel.
3. Choose **Add New Project**.
4. Import the repository.
5. Use these settings:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

6. Click **Deploy**.

### Option B: Deploy with Vercel CLI

Install the Vercel CLI if needed:

```bash
npm install -g vercel
```

Deploy:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

### React Router on Vercel

Because MailRandom is a single-page app, direct visits to routes like `/privacy-policy` or `/tools/qr-code-generator` must fallback to `index.html`.

If needed, create `vercel.json` in the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 10. Deploy to Netlify

### Option A: Deploy from Git Repository

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Log in to Netlify.
3. Choose **Add new site**.
4. Import the repository.
5. Use these settings:

```text
Build command: npm run build
Publish directory: dist
```

6. Deploy the site.

### Option B: Deploy with Netlify CLI

Install the Netlify CLI if needed:

```bash
npm install -g netlify-cli
```

Build the site:

```bash
npm run build
```

Deploy draft:

```bash
netlify deploy --dir=dist
```

Deploy production:

```bash
netlify deploy --prod --dir=dist
```

### React Router on Netlify

Create `public/_redirects` if it does not exist:

```text
/* /index.html 200
```

This allows direct visits to React Router pages.

## 11. Change or Connect a Custom Domain

### Before changing domain

Decide the final domain, for example:

```text
mailrandom.com
www.mailrandom.com
```

Also update project content if needed:

- Brand email in `src/data/tools.js`.
- SEO text in `index.html`.
- Any hard-coded examples in `src/utils/qrUtils.js` or content files.

### Vercel domain setup

1. Open your Vercel project.
2. Go to **Settings** > **Domains**.
3. Add your custom domain.
4. Follow Vercel DNS instructions.
5. Usually you will add records like:

```text
A record for root domain
CNAME record for www
```

Use the exact values shown by Vercel.

### Netlify domain setup

1. Open your Netlify site.
2. Go to **Site configuration** > **Domain management**.
3. Add your custom domain.
4. Follow Netlify DNS instructions.
5. Usually you will add records like:

```text
A record for root domain
CNAME record for www
```

Use the exact values shown by Netlify.

### DNS propagation

DNS changes can take minutes or hours depending on the registrar and TTL settings. After DNS resolves, enable HTTPS in the hosting dashboard if it is not enabled automatically.

## 12. Add a New Tool Later

Follow this pattern to keep the project organized.

### Step 1: Create the tool page

Create a new file in `src/tools/`, for example:

```text
src/tools/MyNewTool.jsx
```

The page should:

- Use `Seo` for title and description.
- Use `ToolShell`, `ResultBox`, `FieldLabel`, and `ActionButton` where possible.
- Keep UI in the tool component.
- Move reusable logic into `src/utils/`.
- Process data locally in the browser.

### Step 2: Create utility logic

If the tool needs reusable logic, create a utility file:

```text
src/utils/myNewToolUtils.js
```

Keep parsing, validation, generation, and formatting logic out of the UI component when practical.

### Step 3: Add route to `src/App.jsx`

Import the new page:

```jsx
import { MyNewTool } from './tools/MyNewTool'
```

Add a route:

```jsx
<Route path='tools/my-new-tool' element={<MyNewTool />} />
```

### Step 4: Add metadata to `src/data/tools.js`

Add a new item to the `tools` array:

```js
{
  title: 'My New Tool',
  path: '/tools/my-new-tool',
  description: 'Short SEO-friendly description of what the tool does.',
  icon: 'FileText',
  accent: 'teal',
}
```

This makes the tool appear in tool cards, footer links, and sitemap data where applicable.

### Step 5: Add translations if needed

If the tool appears on the Home page or localized sections, update:

```text
src/data/i18n.js
```

Add English and Vietnamese descriptions.

### Step 6: Test before deployment

Run:

```bash
npm run lint
npm run build
npm run preview
```

Verify:

- The route loads directly.
- The tool works on mobile and desktop.
- No backend calls are required unless intentionally added.
- SEO title and meta description are correct.

---

# Tài Liệu Tiếng Việt

## 1. Giới thiệu

MailRandom là website cung cấp các công cụ email và web miễn phí, chạy trực tiếp trên trình duyệt. Dự án phù hợp cho người dùng cần thao tác nhanh mà không muốn tạo tài khoản hoặc gửi dữ liệu lên backend ứng dụng.

Các công cụ hiện có:

- Gmail Alias Generator
- Microsoft / Outlook Alias Generator
- Email Extractor Tool
- QR Code Generator
- Bulk URL Opener

Các trang tĩnh/pháp lý:

- Home
- About
- Contact
- Privacy Policy
- Terms and Conditions
- Disclaimer
- DMCA
- Sitemap
- 404 Not Found

## 2. Công nghệ sử dụng

MailRandom sử dụng:

- **React** để xây dựng giao diện theo component.
- **Vite** để chạy dev server nhanh và build production.
- **Tailwind CSS** để tạo giao diện responsive.
- **React Router** để routing phía client.
- **lucide-react** cho icon.
- **jsPDF** để xuất PDF.
- **docx** để xuất DOCX.
- **mammoth** để đọc file DOCX trong Email Extractor.
- **qr-code-styling** để tạo QR code có style.

Đặc điểm dự án:

- Không backend.
- Không database.
- Không hệ thống tài khoản.
- Xử lý trên trình duyệt người dùng.
- Responsive trên mobile, tablet, desktop.
- Phù hợp deploy lên static hosting.

## 3. Yêu cầu môi trường

Khuyến nghị:

- Node.js 20 trở lên.
- npm 10 trở lên.

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

## 4. Cách cài đặt

Mở terminal tại thư mục dự án và chạy:

```bash
npm install
```

Lệnh này cài dependencies theo `package.json` và `package-lock.json`.

## 5. Cách chạy local

Chạy dev server bằng Vite:

```bash
npm run dev
```

Vite sẽ in ra URL local, thường là:

```text
http://localhost:5173/
```

Mở URL đó trên trình duyệt để xem website.

## 6. Cách build production

Tạo bản build tối ưu:

```bash
npm run build
```

Kết quả build nằm trong thư mục:

```text
dist/
```

Khi deploy, bạn deploy nội dung trong thư mục `dist`.

## 7. Cách preview bản build

Sau khi build, chạy:

```bash
npm run preview
```

Lệnh này chạy thử bản production build trên máy local để kiểm tra trước khi deploy.

## 8. Cấu trúc dự án

```text
src/
  components/
    Header.jsx
    Footer.jsx
    ToolCard.jsx
    Seo.jsx
    Layout.jsx
    ContentPage.jsx

  context/
    LanguageProvider.jsx
    languageStore.js
    useLanguage.js

  pages/
    Home.jsx
    About.jsx
    Contact.jsx
    PrivacyPolicy.jsx
    Terms.jsx
    Disclaimer.jsx
    Dmca.jsx
    Sitemap.jsx
    NotFound.jsx

  tools/
    GmailAliasGenerator.jsx
    MicrosoftAliasGenerator.jsx
    EmailExtractor.jsx
    QrCodeGenerator.jsx
    BulkUrlOpener.jsx

  utils/
    aliasUtils.js
    exportUtils.js
    emailExtractorUtils.js
    qrUtils.js
    urlUtils.js

  data/
    tools.js
    faq.js
    i18n.js
```

Các file quan trọng:

- `src/App.jsx`: khai báo routes.
- `src/main.jsx`: entry point React và providers.
- `src/index.css`: Tailwind import, theme token và global CSS.
- `src/data/tools.js`: thông tin thương hiệu, metadata tool, legal pages và route data.
- `src/data/i18n.js`: nội dung tiếng Anh và tiếng Việt cho Home/Header/Footer.
- `src/components/Seo.jsx`: cập nhật title và meta description.
- `vite.config.js`: cấu hình Vite.

## 9. Deploy lên Vercel

### Cách 1: Deploy từ Git repository

1. Push code lên GitHub, GitLab hoặc Bitbucket.
2. Đăng nhập Vercel.
3. Chọn **Add New Project**.
4. Import repository.
5. Dùng cấu hình:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

6. Bấm **Deploy**.

### Cách 2: Deploy bằng Vercel CLI

Cài Vercel CLI nếu cần:

```bash
npm install -g vercel
```

Deploy:

```bash
vercel
```

Deploy production:

```bash
vercel --prod
```

### React Router trên Vercel

Vì MailRandom là single-page app, khi người dùng truy cập trực tiếp `/privacy-policy` hoặc `/tools/qr-code-generator`, server cần fallback về `index.html`.

Nếu cần, tạo file `vercel.json` ở root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 10. Deploy lên Netlify

### Cách 1: Deploy từ Git repository

1. Push code lên GitHub, GitLab hoặc Bitbucket.
2. Đăng nhập Netlify.
3. Chọn **Add new site**.
4. Import repository.
5. Dùng cấu hình:

```text
Build command: npm run build
Publish directory: dist
```

6. Deploy website.

### Cách 2: Deploy bằng Netlify CLI

Cài Netlify CLI nếu cần:

```bash
npm install -g netlify-cli
```

Build website:

```bash
npm run build
```

Deploy draft:

```bash
netlify deploy --dir=dist
```

Deploy production:

```bash
netlify deploy --prod --dir=dist
```

### React Router trên Netlify

Tạo file `public/_redirects` nếu chưa có:

```text
/* /index.html 200
```

Cấu hình này giúp các route React Router hoạt động khi truy cập trực tiếp.

## 11. Cách đổi domain

### Trước khi đổi domain

Chọn domain chính thức, ví dụ:

```text
mailrandom.com
www.mailrandom.com
```

Nên kiểm tra và cập nhật các nội dung liên quan:

- Email thương hiệu trong `src/data/tools.js`.
- SEO mặc định trong `index.html`.
- Ví dụ URL/domain trong `src/utils/qrUtils.js` hoặc các file nội dung.

### Cấu hình domain trên Vercel

1. Vào project trên Vercel.
2. Mở **Settings** > **Domains**.
3. Thêm custom domain.
4. Làm theo hướng dẫn DNS của Vercel.
5. Thường cần thêm record như:

```text
A record cho root domain
CNAME record cho www
```

Dùng đúng giá trị Vercel cung cấp.

### Cấu hình domain trên Netlify

1. Vào site trên Netlify.
2. Mở **Site configuration** > **Domain management**.
3. Thêm custom domain.
4. Làm theo hướng dẫn DNS của Netlify.
5. Thường cần thêm record như:

```text
A record cho root domain
CNAME record cho www
```

Dùng đúng giá trị Netlify cung cấp.

### DNS propagation

DNS có thể mất vài phút đến vài giờ để cập nhật tùy nhà đăng ký domain và TTL. Sau khi DNS hoạt động, bật HTTPS trong dashboard hosting nếu chưa được bật tự động.

## 12. Cách thêm tool mới sau này

Nên làm theo cấu trúc hiện tại để code dễ bảo trì.

### Bước 1: Tạo page tool

Tạo file mới trong `src/tools/`, ví dụ:

```text
src/tools/MyNewTool.jsx
```

Tool page nên:

- Dùng `Seo` cho title và meta description.
- Dùng lại `ToolShell`, `ResultBox`, `FieldLabel`, `ActionButton` nếu phù hợp.
- Giữ UI trong component tool.
- Tách logic xử lý vào `src/utils/`.
- Xử lý dữ liệu local trên browser.

### Bước 2: Tạo utility logic

Nếu tool có logic tái sử dụng, tạo file:

```text
src/utils/myNewToolUtils.js
```

Nên đặt logic parse, validate, generate, format ở utils thay vì viết hết trong UI.

### Bước 3: Thêm route vào `src/App.jsx`

Import page mới:

```jsx
import { MyNewTool } from './tools/MyNewTool'
```

Thêm route:

```jsx
<Route path='tools/my-new-tool' element={<MyNewTool />} />
```

### Bước 4: Thêm metadata vào `src/data/tools.js`

Thêm item mới vào mảng `tools`:

```js
{
  title: 'My New Tool',
  path: '/tools/my-new-tool',
  description: 'Short SEO-friendly description of what the tool does.',
  icon: 'FileText',
  accent: 'teal',
}
```

Metadata này giúp tool xuất hiện trong tool cards, footer và sitemap nếu dùng dữ liệu route hiện có.

### Bước 5: Thêm bản dịch nếu cần

Nếu tool xuất hiện ở Home hoặc khu vực song ngữ, cập nhật:

```text
src/data/i18n.js
```

Thêm mô tả tiếng Anh và tiếng Việt.

### Bước 6: Test trước khi deploy

Chạy:

```bash
npm run lint
npm run build
npm run preview
```

Kiểm tra:

- Route mở được trực tiếp.
- Tool dùng được trên mobile và desktop.
- Không yêu cầu backend nếu tool được thiết kế xử lý local.
- SEO title và meta description đúng.

---

# Required Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```
