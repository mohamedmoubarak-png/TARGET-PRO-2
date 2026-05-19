# ROLE
You are an Expert Senior Frontend Engineer. You are modifying an EXISTING 
working PWA called "Target Pro" hosted at https://target-pro.netlify.app/
Do NOT rebuild from scratch. Apply ONLY the changes described below.

---

# ⛔ ABSOLUTE CONSTRAINTS
- Do NOT touch the existing CSS design system or color variables
- Do NOT change the Header, NavTabs, or PWA config unless explicitly stated
- Do NOT modify localStorage key format for old month data (backward compatible)
- Only modify/add what is explicitly described in this document

---

# CHANGE 1 — Dynamic Product Management (Settings Tab)

## 1.1 — Add a new "Settings" tab
Add a 4th tab to NavTabs:
| Tab ID   | Label          |
|----------|----------------|
| settings | ⚙️ الإعدادات   |

## 1.2 — Product interface update
Replace the fixed Product interface with a fully dynamic one:

```typescript
interface Product {
  id: string;           // uuid — generated on creation
  name: string;         // Arabic name — user defined
  short: string;        // short label for charts — user defined (max 6 chars)
  emoji: string;        // user picks from preset list
  unit: string;         // "عدد" | "ألف ج.م" | "%" — user picks
  color: string;        // user picks from preset palette
  weight: number;       // 0–100 — contribution to overall score %
                        // sum of all weights should equal 100
}
```

## 1.3 — Settings View (SettingsView.tsx)
Build a settings screen with two sections:

### Section A — Product Management
- Display all current products as editable rows
- Each row shows: emoji + name + weight input + color dot + delete button
- "إضافة منتج جديد" button opens an inline form with fields:
  - الاسم (text input, required)
  - الاسم المختصر (text input, max 6 chars)
  - الإيموجي (grid of 20 preset emojis to pick from)
  - الوحدة (select: عدد / ألف ج.م / %)
  - اللون (grid of 12 preset hex colors to pick from)
  - الوزن % (number input 0–100)
- Weight validation: show live total of all weights
  - Green badge if total = 100
  - Red badge if total ≠ 100 with message "مجموع الأوزان = X% (يجب أن يساوي 100%)"
- Save button disabled if total weights ≠ 100
- Delete product: show confirmation "هتحذف [name] — هتتمسح بيانات الشهر الحالي لهذا المنتج"

### Section B — Employee Info
- Editable name field (pre-filled from localStorage)
- Editable job title field (pre-filled from localStorage)
- Save button

## 1.4 — Storage for products
```typescript
localStorage.setItem("tp:products", JSON.stringify(Product[]))
// On app load: if "tp:products" exists → use it
// If not → use the default 6 products (backward compatible)
```

## 1.5 — Preset emoji list (20 options):
🏆 💰 💳 🏦 🛡️ 📱 🎯 📊 💼 🔑 🌟 💎 🏅 📈 🤝 🎁 💡 🔐 🏠 🚗

## 1.6 — Preset color palette (12 options):
#D4A843 #4F9CF9 #A78BFA #34D399 #F87171 #22D3EE
#FB923C #E879F9 #4ADE80 #F472B6 #60A5FA #FACC15

---

# CHANGE 2 — Daily Input Mode (not cumulative)

## 2.1 — How it works
- Current month → DAILY input mode
- Past months → CUMULATIVE input mode (existing behavior)

## 2.2 — Daily data structure
```typescript
interface DailyEntry {
  date: string;       // "YYYY-MM-DD"
  values: {
    [productId: string]: number;
  };
}
// Storage key: "tp:daily:YYYY-MM"
localStorage.setItem("tp:daily:2025-05", JSON.stringify(DailyEntry[]))
```

## 2.3 — Achievements Form (current month only)

**Top — Today's Input:**
- Label: "إنجاز اليوم — [يوم التاريخ]"
- One number input per product (units achieved TODAY only)
- Default: 0 or today's existing entry
- Save button: "💾 حفظ إنجاز اليوم"

**Bottom — Monthly History Table:**
- Last 10 daily entries (most recent first)
- Columns: التاريخ | [each product] | الإجمالي
- Each row is editable (click to edit)
- Row delete button (×)
- Empty state: "لم تسجل أي إنجاز بعد هذا الشهر"

## 2.4 — Cumulative calculation
```typescript
const monthlyAchieved = (productId: string, month: string): number => {
  const entries: DailyEntry[] = JSON.parse(
    localStorage.getItem(`tp:daily:${month}`) || "[]"
  );
  return entries.reduce((sum, e) => sum + (e.values[productId] || 0), 0);
};
```

## 2.5 — Past months
Keep existing single-value input from `tp:m:YYYY-MM`.

---

# CHANGE 3 — Weighted Score System

## 3.1 — Remove raw number aggregation
Delete all code summing target/achieved numbers across products.
Remove "المستهدف الكلي" and "المحقق الكلي" raw sum cards.

## 3.2 — New overall score formula
```typescript
const overallScore = products.reduce((sum, p) => {
  const pct = p.target > 0 ? Math.min((p.achieved / p.target) * 100, 100) : 0;
  return sum + pct * (p.weight / 100);
}, 0);
// Result: 0–100
```

## 3.3 — Update HeroCard
Ring chart center: `overallScore.toFixed(1)` + label "درجة الأداء / 100"

4 KPI mini-cards:
| Label          | Value                      | Color |
|----------------|----------------------------|-------|
| درجة الأداء    | overallScore.toFixed(1)    | gold  |
| أعلى منتج      | best product name + score% | green |
| أحتاج تطوير    | worst product name + score%| red   |
| أيام متبقية    | days remaining             | blue  |

## 3.4 — Update ProductCard
- Show achievement % as primary metric
- Badge: "يساهم بـ [weight]% في درجتك"
- Progress bar based on achievement %

## 3.5 — Update SmartTips engine
Use `achievementPct` and `overallScore` instead of raw gap numbers.

---

# CHANGE 4 — Year-to-Date (YTD) Dashboard

## 4.1 — Collapsible YTD section
Add below monthly dashboard:
Title: "📅 أداؤك من بداية السنة حتى اليوم"
Collapsed by default. Toggle arrow rotates 180° on expand.

## 4.2 — YTD data loading
```typescript
const ytdMonths = Array.from({ length: currentMonth }, (_, i) => {
  const m = String(i + 1).padStart(2, "0");
  return `${currentYear}-${m}`;
});
```

## 4.3 — YTD metrics

### KPI Row:
| Label             | Value                                           |
|-------------------|-------------------------------------------------|
| متوسط الأداء YTD  | avg overallScore across months with data        |
| أفضل شهر          | month with highest overallScore                 |
| أضعف شهر          | month with lowest overallScore                  |
| أشهر بيانات        | count of months with any target set             |

### YTD BarChart (Recharts):
- X-axis: month names
- Y-axis: 0–100
- One bar per month = overallScore
- Gold gradient bars, current month in brighter gold
- Months with no data = 0

### YTD Product Table:
- Columns: المنتج | متوسط الإنجاز % | الوزن | متوسط الدرجة المرجحة
- Sort by weighted score descending
- Color rows: green ≥80% | gold ≥50% | red <50%

---

# CHANGE 5 — Welcome Screen: Name + Job Title

## 5.1 — Update WelcomeModal
Add a second input field below the name:

```
[اسمك بالكامل]       ← existing
[وظيفتك / مسماك الوظيفي]  ← NEW
```

Both fields required before enabling the "ابدأ الآن" button.

## 5.2 — Storage
```typescript
localStorage.setItem("tp:employee", JSON.stringify("Mohamed"))   // existing
localStorage.setItem("tp:jobtitle", JSON.stringify("مدير علاقات عملاء"))  // NEW
```

## 5.3 — Header display
Update the employee display in the header to show:
```
👤 Mohamed
   مدير علاقات عملاء    ← smaller, muted text below name
```

---

# CHANGE 6 — Disable Text Selection (Anti-Highlight)

## 6.1 — Global CSS rule
Add to `global.css`:
```css
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;   /* iOS: disables long-press menu */
  -webkit-tap-highlight-color: transparent; /* removes tap flash on mobile */
}

/* Allow selection ONLY inside input and textarea */
input, textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  user-select: text;
}
```

## 6.2 — Prevent context menu on long press (mobile)
Add to the root `<div>` in App.tsx:
```tsx
onContextMenu={(e) => e.preventDefault()}
```

---

# CHANGE 7 — PWA: Install Prompt + Icon + Splash Screen

## 7.1 — Install prompt banner
Show a sticky bottom banner when the app is installable (beforeinstallprompt event):

```tsx
// hooks/useInstallPrompt.ts
export function useInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === "accepted") setIsInstalled(true);
    setPrompt(null);
  };

  return { canInstall: !!prompt && !isInstalled, install };
}
```

Banner UI (shown at bottom of screen):
```
┌─────────────────────────────────────────┐
│  📲  ثبّت التطبيق على شاشتك الرئيسية   │
│  [ثبّت الآن]              [لاحقاً ×]   │
└─────────────────────────────────────────┘
```
Style:
- Fixed bottom, full width
- Background: linear-gradient(135deg, #D4A843, #f0c857)
- Color: #060d1a
- Padding: 14px 20px
- Z-index: 100
- Slide up animation on appear
- Dismissed permanently via localStorage flag: `tp:install-dismissed`

## 7.2 — PWA Manifest (update vite.config.ts)
```typescript
VitePWA({
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "icon-192.png", "icon-512.png", "splash.png"],
  manifest: {
    name: "Target Pro — نظام المستهدفات البنكية",
    short_name: "Target Pro",
    description: "تتبع مستهدفاتك البنكية باحترافية",
    theme_color: "#060d1a",
    background_color: "#060d1a",
    display: "standalone",
    orientation: "portrait",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: { cacheName: "google-fonts", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
      }
    ]
  }
})
```

## 7.3 — Splash screen component (SplashScreen.tsx)
Show on first app load for 1.8 seconds, then fade out:

```tsx
// Shown when app first mounts, before data loads
// Hidden after 1800ms with a fade-out transition

const SplashScreen = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 9999,
    background: "#060d1a",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,168,67,0.15), transparent)"
  }}>
    {/* Logo icon */}
    <div style={{
      width: 88, height: 88, borderRadius: 24,
      background: "linear-gradient(135deg, #D4A843, #f0c857)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "2.5rem", marginBottom: 20,
      boxShadow: "0 0 40px rgba(212,168,67,0.35)"
    }}>📊</div>

    {/* App name */}
    <h1 style={{ color: "#D4A843", fontSize: "1.8rem", fontWeight: 900,
      fontFamily: "'Cairo', sans-serif", marginBottom: 6 }}>
      Target Pro
    </h1>
    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem",
      fontFamily: "'Cairo', sans-serif" }}>
      نظام المستهدفات البنكية الاحترافي
    </p>

    {/* Loading dots */}
    <div style={{ marginTop: 40, display: "flex", gap: 8 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#D4A843", opacity: 0.4,
          animation: `bounce 1.2s ease ${i * 0.2}s infinite`
        }}/>
      ))}
    </div>
  </div>
);
```

Add keyframe to animations.css:
```css
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
  40%           { transform: scale(1.2); opacity: 1; }
}
```

Splash logic in App.tsx:
```tsx
const [showSplash, setShowSplash] = useState(true);
useEffect(() => {
  const t = setTimeout(() => setShowSplash(false), 1800);
  return () => clearTimeout(t);
}, []);

// In JSX:
{showSplash && <SplashScreen />}
```

## 7.4 — Required icon files
Create these files in `/public/`:
- `icon-192.png` — 192×192px — gold gradient background (#D4A843→#f0c857) with 📊 centered in white
- `icon-512.png` — 512×512px — same design scaled up
- Generate programmatically using Canvas API in a build script, or provide as static assets

---

# CHANGE 8 — PDF Export

## 8.1 — Library
Use `jsPDF` + `html2canvas`:
```bash
npm install jspdf html2canvas
```

## 8.2 — Export button placement
Add an "📄 تصدير PDF" button in the Dashboard tab:
- Position: top-left of the dashboard, next to the month navigator area
- Style: `.btn .btn--ghost` with a PDF icon
- Only visible when at least one product has data

## 8.3 — PDF content structure
The exported PDF should contain:

### Page 1 — Monthly Report
```
┌─────────────────────────────────────────────────────┐
│  Target Pro — تقرير الأداء الشهري                   │
│  الموظف: [name] | الوظيفة: [jobTitle]               │
│  الشهر: [month label] | تاريخ التصدير: [today]      │
├─────────────────────────────────────────────────────┤
│  درجة الأداء الكلية: [overallScore]/100             │
│  ████████████░░░░ 73.4%                              │
├─────────────────────────────────────────────────────┤
│  تفاصيل المنتجات                                    │
│  ┌──────────────┬──────────┬──────────┬──────────┐  │
│  │ المنتج       │ المستهدف │ المحقق   │ النسبة   │  │
│  ├──────────────┼──────────┼──────────┼──────────┤  │
│  │ 🏆 الشهادات  │  50      │  38      │  76%     │  │
│  │ 💰 القروض    │  2,500K  │  1,800K  │  72%     │  │
│  │ ...          │  ...     │  ...     │  ...     │  │
│  └──────────────┴──────────┴──────────┴──────────┘  │
├─────────────────────────────────────────────────────┤
│  النصائح الذكية                                     │
│  ⚠️ [tip 1 text]                                    │
│  💡 [tip 2 text]                                    │
└─────────────────────────────────────────────────────┘
```

### Page 2 — YTD Summary (if data exists for multiple months)
- YTD average score
- Month-by-month score table
- Best/worst month

## 8.4 — PDF generation function
```typescript
// utils/exportPDF.ts
import jsPDF from "jspdf";

export async function exportMonthlyReport(params: {
  employeeName: string;
  jobTitle: string;
  month: string;
  overallScore: number;
  products: ProductStats[];
  tips: Tip[];
  ytdData?: YTDSummary;
}): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // RTL Arabic support:
  // jsPDF does not support Arabic natively.
  // Use this approach:
  // 1. Render the report content into a hidden <div> with full Arabic styling
  // 2. Use html2canvas to capture it as an image
  // 3. Embed the image into jsPDF

  // Hidden div approach:
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed; top: -9999px; left: -9999px;
    width: 794px; padding: 48px;
    background: #060d1a; color: #e8edf8;
    font-family: 'Cairo', sans-serif;
    direction: rtl; text-align: right;
  `;
  container.innerHTML = buildReportHTML(params);
  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#060d1a",
  });

  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  if (imgHeight > 297) {
    // Add second page if content overflows A4
    doc.addPage();
    doc.addImage(imgData, "PNG", 0, -(297), imgWidth, imgHeight);
  }

  doc.save(`Target-Pro-${params.month}-${params.employeeName}.pdf`);
}
```

## 8.5 — buildReportHTML function
```typescript
function buildReportHTML(params: ReportParams): string {
  return `
    <div style="font-family:'Cairo',sans-serif;direction:rtl;color:#e8edf8;">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:32px;
                  padding-bottom:16px;border-bottom:2px solid rgba(212,168,67,0.3)">
        <div style="width:56px;height:56px;border-radius:14px;
                    background:linear-gradient(135deg,#D4A843,#f0c857);
                    display:flex;align-items:center;justify-content:center;font-size:1.8rem">📊</div>
        <div>
          <div style="font-size:1.4rem;font-weight:900;color:#D4A843">Target Pro</div>
          <div style="font-size:0.85rem;color:rgba(255,255,255,0.5)">تقرير الأداء الشهري</div>
        </div>
        <div style="margin-right:auto;text-align:left;font-size:0.8rem;color:rgba(255,255,255,0.4)">
          <div>${params.employeeName} — ${params.jobTitle}</div>
          <div>${params.month}</div>
          <div>تصدير: ${new Date().toLocaleDateString("ar-EG")}</div>
        </div>
      </div>

      <!-- Overall Score -->
      <div style="background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.25);
                  border-radius:16px;padding:24px;margin-bottom:24px;text-align:center">
        <div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:8px">درجة الأداء الكلية</div>
        <div style="font-size:3rem;font-weight:900;color:#D4A843">${params.overallScore.toFixed(1)}</div>
        <div style="font-size:0.9rem;color:rgba(255,255,255,0.4)">من 100 درجة</div>
        <!-- Progress bar -->
        <div style="height:10px;background:rgba(255,255,255,0.08);border-radius:99px;margin-top:16px;overflow:hidden">
          <div style="height:100%;width:${params.overallScore}%;
                      background:linear-gradient(90deg,#D4A843,#f0c857);border-radius:99px"></div>
        </div>
      </div>

      <!-- Products Table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="background:rgba(255,255,255,0.05)">
            <th style="padding:12px;text-align:right;font-size:0.8rem;color:rgba(255,255,255,0.5)">المنتج</th>
            <th style="padding:12px;text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.5)">المستهدف</th>
            <th style="padding:12px;text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.5)">المحقق</th>
            <th style="padding:12px;text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.5)">النسبة</th>
            <th style="padding:12px;text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.5)">الدرجة المرجحة</th>
          </tr>
        </thead>
        <tbody>
          ${params.products.map(p => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
              <td style="padding:12px">${p.emoji} ${p.name}</td>
              <td style="padding:12px;text-align:center">${p.target}</td>
              <td style="padding:12px;text-align:center">${p.achieved}</td>
              <td style="padding:12px;text-align:center;color:${p.pct>=80?'#34D399':p.pct>=50?'#D4A843':'#F87171'};font-weight:700">
                ${p.pct.toFixed(0)}%
              </td>
              <td style="padding:12px;text-align:center;color:#D4A843;font-weight:700">
                ${(p.pct * p.weight / 100).toFixed(1)}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <!-- Tips -->
      <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px">
        <div style="font-size:0.95rem;font-weight:700;margin-bottom:14px">🧠 النصائح الذكية</div>
        ${params.tips.map(t => `
          <div style="display:flex;gap:10px;margin-bottom:10px;
                      padding:10px;border-radius:8px;background:rgba(255,255,255,0.04)">
            <span>${t.icon}</span>
            <div>
              <div style="font-weight:700;font-size:0.85rem;margin-bottom:3px">${t.title}</div>
              <div style="font-size:0.78rem;color:rgba(255,255,255,0.55);line-height:1.6">${t.text}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
```

---

# CHANGE 9 — Smoothness & Performance Audit

Apply ALL of the following improvements:

## 9.1 — Prevent layout shift on load
- Set explicit min-height on all cards to prevent content jumping
- Add `will-change: transform` to animated elements
- Use `opacity: 0` + `animation-fill-mode: both` for all fade-in elements

## 9.2 — Touch responsiveness
- All buttons: `touch-action: manipulation` (prevents 300ms delay)
- All buttons: `cursor: pointer` explicitly set
- Remove any `transition` on tap/click to keep feedback instant

## 9.3 — Scroll behavior
Add to `global.css`:
```css
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
body {
  overscroll-behavior: none;   /* prevents bounce on iOS */
  -webkit-overflow-scrolling: touch;
}
```

## 9.4 — Input UX on mobile
- All number inputs: `inputMode="decimal"` attribute
- All number inputs: `pattern="[0-9]*"` attribute
- Prevents keyboard layout issues on iOS

## 9.5 — Font preloading
Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap">
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap">
```
Remove the dynamic `useEffect` font injection — use static HTML link instead.

## 9.6 — useMemo audit
Ensure ALL of the following are memoized:
- `stats` computation (targets, achieved, gap, pct per product)
- `overallScore` calculation
- `tips` array from tipsEngine
- `ytdData` computation
- `chartData` array for Recharts

## 9.7 — Tab switching animation
Add smooth fade transition between tabs:
```css
.tab-content {
  animation: fadeIn 0.25s ease both;
}
```
Apply `.tab-content` class to the root div of each tab view.

---

# STORAGE SUMMARY (all keys)

| Key                    | Content                                           |
|------------------------|---------------------------------------------------|
| `tp:employee`          | string — employee name (existing)                 |
| `tp:jobtitle`          | string — job title (NEW)                          |
| `tp:products`          | Product[] — custom product list (NEW)             |
| `tp:m:YYYY-MM`         | MonthData — past month cumulative (existing)      |
| `tp:daily:YYYY-MM`     | DailyEntry[] — current month daily entries (NEW)  |
| `tp:install-dismissed` | "1" — user dismissed install banner (NEW)         |

---

# DELIVERABLE FORMAT
- Provide changes as clearly labeled file blocks
- Each file starts with: `// FILE: src/path/to/file.tsx`
- New code marked with: `// [NEW]`
- Modified code marked with: `// [MODIFIED]`
- Code to delete marked with: `// [DELETE THIS BLOCK]`
- Do NOT rewrite files that have zero changes
- Do NOT change CSS variables or design tokens
- Provide `npm install` command at the top for any new dependencies
