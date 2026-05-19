import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ProductStats, Tip, YTDSummary } from "../types";
import { getMonthLabel } from "./dateUtils";
import { dict, Lang } from "../i18n/translations";

interface ExportParams {
  employeeName: string;
  jobTitle: string;
  month: string;
  overallScore: number;
  products: ProductStats[];
  tips: Tip[];
  ytd?: YTDSummary;
  lang: Lang;
}

function escapeHTML(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReportHTML(p: ExportParams): string {
  const t = dict[p.lang];
  const dir = p.lang === "ar" ? "rtl" : "ltr";
  const alignStart = p.lang === "ar" ? "right" : "left";
  const alignEnd = p.lang === "ar" ? "left" : "right";

  const monthLabel = getMonthLabel(p.month, p.lang);
  const today = new Date().toLocaleDateString(p.lang === "ar" ? "ar-EG-u-nu-latn" : "en-US");

  const productsRows = p.products.map(pr => `
    <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
      <td style="padding:12px;text-align:${alignStart}">${pr.emoji} ${escapeHTML(pr.name)}</td>
      <td style="padding:12px;text-align:center">${pr.target}</td>
      <td style="padding:12px;text-align:center">${pr.achieved}</td>
      <td style="padding:12px;text-align:center;color:${pr.pct >= 80 ? "#34D399" : pr.pct >= 50 ? "#D4A843" : "#F87171"};font-weight:700">
        ${pr.pct.toFixed(0)}%
      </td>
      <td style="padding:12px;text-align:center;color:#D4A843;font-weight:700">
        ${pr.weightedScore.toFixed(1)}
      </td>
    </tr>
  `).join("");

  const tipsHTML = p.tips.map(tp => `
    <div style="display:flex;gap:10px;margin-bottom:10px;padding:10px;border-radius:8px;background:rgba(255,255,255,0.04)">
      <span style="font-size:1.1rem">${tp.icon}</span>
      <div>
        <div style="font-weight:700;font-size:0.85rem;margin-bottom:3px">${escapeHTML(tp.title)}</div>
        <div style="font-size:0.78rem;color:rgba(255,255,255,0.55);line-height:1.6">${escapeHTML(tp.text)}</div>
      </div>
    </div>
  `).join("");

  const ytdHTML = p.ytd && p.ytd.monthsWithData > 1 ? `
    <div style="margin-top:32px;padding-top:24px;border-top:2px solid rgba(212,168,67,0.3)">
      <div style="font-size:1.05rem;font-weight:800;color:#D4A843;margin-bottom:14px">${t.pdf_ytd_title}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px">
        <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px">
          <div style="font-size:0.72rem;color:rgba(255,255,255,0.5)">${t.pdf_ytd_avg}</div>
          <div style="font-size:1.2rem;font-weight:900;color:#D4A843">${p.ytd.avgScore.toFixed(1)}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px">
          <div style="font-size:0.72rem;color:rgba(255,255,255,0.5)">${t.pdf_ytd_best}</div>
          <div style="font-size:0.95rem;font-weight:800;color:#34D399">${p.ytd.bestMonth ? `${p.ytd.bestMonth.label} (${p.ytd.bestMonth.score.toFixed(1)})` : "—"}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:10px">
          <div style="font-size:0.72rem;color:rgba(255,255,255,0.5)">${t.pdf_ytd_worst}</div>
          <div style="font-size:0.95rem;font-weight:800;color:#F87171">${p.ytd.worstMonth ? `${p.ytd.worstMonth.label} (${p.ytd.worstMonth.score.toFixed(1)})` : "—"}</div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:0.82rem">
        <thead>
          <tr style="background:rgba(255,255,255,0.05)">
            <th style="padding:10px;text-align:${alignStart};color:rgba(255,255,255,0.6)">${t.pdf_ytd_th_month}</th>
            <th style="padding:10px;text-align:center;color:rgba(255,255,255,0.6)">${t.pdf_ytd_th_score}</th>
          </tr>
        </thead>
        <tbody>
          ${p.ytd.months.map(m => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
              <td style="padding:9px 10px;text-align:${alignStart}">${m.label}</td>
              <td style="padding:9px 10px;text-align:center;font-weight:700;color:${m.score >= 80 ? "#34D399" : m.score >= 50 ? "#D4A843" : "#F87171"}">
                ${m.hasData ? m.score.toFixed(1) : "—"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  ` : "";

  return `
    <div style="font-family:'Cairo',sans-serif;direction:${dir};color:#e8edf8;background:#060d1a;padding:48px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:32px;padding-bottom:16px;border-bottom:2px solid rgba(212,168,67,0.3)">
        <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#D4A843,#f0c857);display:flex;align-items:center;justify-content:center;font-size:1.8rem">🎯</div>
        <div style="flex:1">
          <div style="font-size:1.4rem;font-weight:900;color:#D4A843">${t.brand_title}</div>
          <div style="font-size:0.85rem;color:rgba(255,255,255,0.5)">${t.pdf_report_title}</div>
        </div>
        <div style="text-align:${alignEnd};font-size:0.8rem;color:rgba(255,255,255,0.55)">
          <div style="margin-bottom:3px;font-weight:700">${escapeHTML(p.employeeName)} — ${escapeHTML(p.jobTitle)}</div>
          <div style="margin-bottom:3px">${monthLabel}</div>
          <div>${t.pdf_export_label}: ${today}</div>
        </div>
      </div>

      <div style="background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.25);border-radius:16px;padding:24px;margin-bottom:24px;text-align:center">
        <div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:8px">${t.pdf_overall_label}</div>
        <div style="font-size:3rem;font-weight:900;color:#D4A843">${p.overallScore.toFixed(1)}</div>
        <div style="font-size:0.9rem;color:rgba(255,255,255,0.4)">${t.pdf_overall_of}</div>
        <div style="height:10px;background:rgba(255,255,255,0.08);border-radius:99px;margin-top:16px;overflow:hidden">
          <div style="height:100%;width:${Math.min(p.overallScore, 100)}%;background:linear-gradient(90deg,#D4A843,#f0c857);border-radius:99px"></div>
        </div>
      </div>

      <div style="font-size:0.95rem;font-weight:800;margin-bottom:12px;color:#D4A843">${t.pdf_products_section}</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:0.85rem">
        <thead>
          <tr style="background:rgba(255,255,255,0.05)">
            <th style="padding:12px;text-align:${alignStart};color:rgba(255,255,255,0.6)">${t.pdf_th_product}</th>
            <th style="padding:12px;text-align:center;color:rgba(255,255,255,0.6)">${t.pdf_th_target}</th>
            <th style="padding:12px;text-align:center;color:rgba(255,255,255,0.6)">${t.pdf_th_achieved}</th>
            <th style="padding:12px;text-align:center;color:rgba(255,255,255,0.6)">${t.pdf_th_pct}</th>
            <th style="padding:12px;text-align:center;color:rgba(255,255,255,0.6)">${t.pdf_th_weighted}</th>
          </tr>
        </thead>
        <tbody>${productsRows}</tbody>
      </table>

      ${p.tips.length > 0 ? `
        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px">
          <div style="font-size:0.95rem;font-weight:700;margin-bottom:14px">${t.pdf_tips_title}</div>
          ${tipsHTML}
        </div>
      ` : ""}

      ${ytdHTML}
    </div>
  `;
}

export async function exportMonthlyReport(params: ExportParams): Promise<void> {
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed; top: -10000px; left: -10000px;
    width: 794px; background: #060d1a;
    direction: ${params.lang === "ar" ? "rtl" : "ltr"};
  `;
  container.innerHTML = buildReportHTML(params);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#060d1a",
      logging: false
    });

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL("image/png");

    if (imgHeight <= pageHeight) {
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      let remaining = imgHeight;
      let position = 0;
      while (remaining > 0) {
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        remaining -= pageHeight;
        if (remaining > 0) {
          doc.addPage();
          position -= pageHeight;
        }
      }
    }

    doc.save(`Target-Pro-${params.month}-${params.employeeName}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
