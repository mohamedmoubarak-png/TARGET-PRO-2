export type Lang = "ar" | "en";

export interface TString {
  brand_title: string;
  brand_subtitle: string;

  tab_dashboard: string;
  tab_targets: string;
  tab_achieved: string;
  tab_settings: string;

  common_save: string;
  common_cancel: string;
  common_delete: string;
  common_add: string;
  common_edit: string;
  common_back_today: string;
  common_loading: string;
  common_yes: string;
  common_no: string;

  prev_month: string;
  next_month: string;
  online: string;

  welcome_title: string;
  welcome_subtitle: string;
  welcome_name_ph: string;
  welcome_job_ph: string;
  welcome_start: string;

  splash_subtitle: string;
  install_msg: string;
  install_install: string;
  install_later: string;

  loading_data: string;

  hero_heading_excellent: string;
  hero_heading_on_track: string;
  hero_heading_keep_going: string;
  hero_heading_start_pushing: string;
  hero_kpi_score: string;
  hero_kpi_best: string;
  hero_kpi_worst: string;
  hero_kpi_days_left: string;

  ring_label: string;

  product_card_target: string;
  product_card_achieved: string;
  product_card_weight: string;

  compare_title: string;
  compare_y_label: string;
  compare_tooltip_pct: string;

  tips_title: string;
  tips_badge: string;

  ytd_title: string;
  ytd_avg: string;
  ytd_best_month: string;
  ytd_worst_month: string;
  ytd_months_with_data: string;
  ytd_table_product: string;
  ytd_table_avg_pct: string;
  ytd_table_weight: string;
  ytd_table_weighted: string;

  dash_export: string;
  dash_exporting: string;

  targets_title: (month: string) => string;
  targets_hint: string;
  targets_placeholder: string;
  targets_save: string;

  ach_today_title: (date: string) => string;
  ach_pastday_title: (date: string) => string;
  ach_today_hint: string;
  ach_pastday_hint: string;
  ach_date_label: string;
  ach_back_today: string;
  ach_input_today_ph: string;
  ach_input_pastday_ph: string;
  ach_month_target: (n: string, unit: string) => string;
  ach_save_today: string;
  ach_update_pastday: string;
  ach_add_pastday: string;
  ach_history_title: string;
  ach_history_empty: string;
  ach_history_th_date: string;
  ach_history_th_pct: string;
  ach_delete_confirm: (d: string) => string;

  cum_title: (month: string) => string;
  cum_hint: string;
  cum_placeholder_with_target: (n: string, unit: string) => string;
  cum_placeholder_no_target: string;
  cum_save: string;

  settings_products_title: string;
  settings_products_hint: string;
  settings_total_weight: string;
  settings_total_must_be_100: string;
  settings_add_product: string;
  settings_save_changes: string;
  settings_form_name: string;
  settings_form_short: string;
  settings_form_short_ph: string;
  settings_form_emoji: string;
  settings_form_unit: string;
  settings_form_weight: string;
  settings_form_color: string;
  settings_form_save: string;
  settings_form_cancel: string;
  settings_delete_confirm: (name: string) => string;
  settings_name_short_required: string;
  settings_employee_title: string;
  settings_employee_hint: string;
  settings_employee_name: string;
  settings_employee_job: string;
  settings_employee_save: string;
  settings_employee_required: string;

  toast_targets_saved: string;
  toast_ach_saved: string;
  toast_daily_saved: string;
  toast_deleted: string;
  toast_products_saved: string;
  toast_employee_saved: string;
  toast_pdf_ok: string;
  toast_pdf_err: string;

  footer_text: string;
  developer_credit: string;

  // Bottom nav (shorter labels than top tabs)
  bn_dashboard: string;
  bn_targets: string;
  bn_achieved: string;
  bn_settings: string;

  // View toggle (Month vs YTD)
  view_ytd: string;

  // YTD view (dedicated mode, full screen)
  ytd_hero_label: string;
  ytd_kpi_avg: string;
  ytd_kpi_best: string;
  ytd_kpi_worst: string;
  ytd_kpi_logged: string;
  ytd_chart_title: string;
  ytd_table_title: string;
  ytd_tips_title: string;
  ytd_empty: string;

  ytd_tip_excellent_title: string;
  ytd_tip_excellent: (avg: number) => string;
  ytd_tip_good_title: string;
  ytd_tip_good: (avg: number) => string;
  ytd_tip_low_title: string;
  ytd_tip_low: (avg: number) => string;
  ytd_tip_best_title: string;
  ytd_tip_best: (month: string, score: number) => string;
  ytd_tip_worst_title: string;
  ytd_tip_worst: (month: string, score: number) => string;

  months_full: string[];
  months_short: string[];

  unit_count: string;
  unit_thousands_egp: string;
  unit_percent: string;

  pdf_report_title: string;
  pdf_overall_label: string;
  pdf_overall_of: string;
  pdf_products_section: string;
  pdf_th_product: string;
  pdf_th_target: string;
  pdf_th_achieved: string;
  pdf_th_pct: string;
  pdf_th_weighted: string;
  pdf_tips_title: string;
  pdf_ytd_title: string;
  pdf_ytd_avg: string;
  pdf_ytd_best: string;
  pdf_ytd_worst: string;
  pdf_ytd_th_month: string;
  pdf_ytd_th_score: string;
  pdf_export_label: string;
}

export const dict: Record<Lang, TString> = {
  ar: {
    brand_title: "Target Pro",
    brand_subtitle: "نظام المستهدفات البنكية",

    tab_dashboard: "📊 لوحة التحكم",
    tab_targets: "🎯 المستهدفات",
    tab_achieved: "✅ الإنجاز",
    tab_settings: "⚙️ الإعدادات",

    common_save: "حفظ",
    common_cancel: "إلغاء",
    common_delete: "حذف",
    common_add: "إضافة",
    common_edit: "تعديل",
    common_back_today: "↩ ارجع لليوم",
    common_loading: "جاري التحميل…",
    common_yes: "نعم",
    common_no: "لا",

    prev_month: "الشهر السابق",
    next_month: "الشهر التالي",
    online: "متصل",

    welcome_title: "Target Pro",
    welcome_subtitle: "نظام تتبع المستهدفات البنكية الاحترافي — البيانات محفوظة محلياً على جهازك بالكامل",
    welcome_name_ph: "اسمك بالكامل",
    welcome_job_ph: "وظيفتك / مسماك الوظيفي",
    welcome_start: "ابدأ الآن 🚀",

    splash_subtitle: "نظام المستهدفات البنكية الاحترافي",
    install_msg: "📲 ثبّت التطبيق على شاشتك الرئيسية",
    install_install: "ثبّت الآن",
    install_later: "لاحقاً ✕",

    loading_data: "جاري تحميل بياناتك…",

    hero_heading_excellent: "🏆 تجاوزت المستهدف!",
    hero_heading_on_track: "🚀 في المسار الصح",
    hero_heading_keep_going: "💪 استمر وزد السرعة",
    hero_heading_start_pushing: "⚡ ابدأ الضغط دلوقتي",
    hero_kpi_score: "درجة الأداء",
    hero_kpi_best: "أعلى منتج",
    hero_kpi_worst: "أحتاج تطوير",
    hero_kpi_days_left: "أيام متبقية",

    ring_label: "درجة الأداء / 100",

    product_card_target: "هدف",
    product_card_achieved: "محقق",
    product_card_weight: "وزن",

    compare_title: "📈 نسبة الإنجاز لكل منتج",
    compare_y_label: "%",
    compare_tooltip_pct: "نسبة الإنجاز",

    tips_title: "🧠 النصائح الذكية",
    tips_badge: "مخصصة لك",

    ytd_title: "📅 أداؤك من بداية السنة حتى اليوم",
    ytd_avg: "متوسط الأداء YTD",
    ytd_best_month: "أفضل شهر",
    ytd_worst_month: "أضعف شهر",
    ytd_months_with_data: "أشهر فيها بيانات",
    ytd_table_product: "المنتج",
    ytd_table_avg_pct: "متوسط الإنجاز %",
    ytd_table_weight: "الوزن",
    ytd_table_weighted: "الدرجة المرجحة",

    dash_export: "📄 تصدير PDF",
    dash_exporting: "⏳ جاري التصدير…",

    targets_title: (m) => `🎯 مستهدفات ${m}`,
    targets_hint: "أدخل مستهدفك الشهري لكل منتج. الأرقام بتتحفظ على جهازك فوراً.",
    targets_placeholder: "أدخل المستهدف",
    targets_save: "💾 حفظ المستهدفات",

    ach_today_title: (d) => `✅ إنجاز اليوم — ${d}`,
    ach_pastday_title: (d) => `✅ تعديل إنجاز يوم سابق — ${d}`,
    ach_today_hint: "أدخل ما أنجزته اليوم فقط لكل منتج (مش تراكمي). الإجمالي بيتحسب أوتوماتيك.",
    ach_pastday_hint: "اختر يوم سابق من الشهر الحالي لتعديل أو إضافة إنجازه.",
    ach_date_label: "تاريخ الإدخال",
    ach_back_today: "↩ ارجع لليوم",
    ach_input_today_ph: "عدد ما أنجزته اليوم",
    ach_input_pastday_ph: "عدد ما أنجزته في هذا اليوم",
    ach_month_target: (n, u) => `هدف الشهر: ${n} ${u}`,
    ach_save_today: "💾 حفظ إنجاز اليوم",
    ach_update_pastday: "💾 تحديث إنجاز هذا اليوم",
    ach_add_pastday: "💾 إضافة إنجاز هذا اليوم",
    ach_history_title: "📋 سجل آخر 10 أيام",
    ach_history_empty: "لم تسجل أي إنجاز بعد هذا الشهر",
    ach_history_th_date: "التاريخ",
    ach_history_th_pct: "نسبة الإنجاز",
    ach_delete_confirm: (d) => `تأكيد حذف إنجاز ${d}؟`,

    cum_title: (m) => `✅ تسجيل الإنجاز — ${m}`,
    cum_hint: "الشهور السابقة بتسجل الرقم الكلي المحقق لكل منتج.",
    cum_placeholder_with_target: (n, u) => `من أصل ${n} ${u}`,
    cum_placeholder_no_target: "لم يتم تحديد مستهدف",
    cum_save: "💾 حفظ الإنجازات",

    settings_products_title: "⚙️ إدارة المنتجات",
    settings_products_hint: "يمكنك إضافة، تعديل، أو حذف المنتجات. مجموع الأوزان لازم يساوي 100%.",
    settings_total_weight: "مجموع الأوزان",
    settings_total_must_be_100: "يجب أن يساوي 100%",
    settings_add_product: "➕ إضافة منتج جديد",
    settings_save_changes: "💾 حفظ التغييرات",
    settings_form_name: "الاسم",
    settings_form_short: "الاسم المختصر",
    settings_form_short_ph: "حد أقصى 6",
    settings_form_emoji: "الإيموجي",
    settings_form_unit: "الوحدة",
    settings_form_weight: "الوزن %",
    settings_form_color: "اللون",
    settings_form_save: "➕ إضافة",
    settings_form_cancel: "إلغاء",
    settings_delete_confirm: (n) => `سيتم حذف ${n} — وستتمسح بيانات الشهر الحالي لهذا المنتج. هل أنت متأكد؟`,
    settings_name_short_required: "الاسم والاسم المختصر مطلوبان",
    settings_employee_title: "👤 بياناتك الشخصية",
    settings_employee_hint: "عدّل اسمك أو مسماك الوظيفي.",
    settings_employee_name: "الاسم",
    settings_employee_job: "المسمى الوظيفي",
    settings_employee_save: "💾 حفظ بياناتي",
    settings_employee_required: "الاسم والوظيفة مطلوبان",

    toast_targets_saved: "تم حفظ المستهدفات بنجاح ✅",
    toast_ach_saved: "تم تحديث الإنجازات بنجاح ✅",
    toast_daily_saved: "تم حفظ إنجاز اليوم ✅",
    toast_deleted: "تم الحذف",
    toast_products_saved: "تم حفظ المنتجات ✅",
    toast_employee_saved: "تم تحديث بياناتك ✅",
    toast_pdf_ok: "تم تصدير التقرير ✅",
    toast_pdf_err: "فشل التصدير، حاول مرة تانية",

    footer_text: "Target Pro — البيانات محفوظة محلياً على جهازك | لا يوجد سيرفر أو تسجيل دخول",
    developer_credit: "تطوير: MOHAMED SAYED",

    bn_dashboard: "الرئيسية",
    bn_targets: "المستهدف",
    bn_achieved: "الإنجاز",
    bn_settings: "الإعدادات",

    view_ytd: "📈 من بداية السنة",

    ytd_hero_label: "متوسط الأداء / 100",
    ytd_kpi_avg: "متوسط YTD",
    ytd_kpi_best: "أفضل شهر",
    ytd_kpi_worst: "أضعف شهر",
    ytd_kpi_logged: "أشهر مسجّلة",
    ytd_chart_title: "📊 الأداء الشهري عبر السنة",
    ytd_table_title: "📋 تفصيل المنتجات سنوياً",
    ytd_tips_title: "🧠 تحليل ذكي للسنة",
    ytd_empty: "لا توجد بيانات مسجّلة هذا العام بعد",

    ytd_tip_excellent_title: "أداء سنوي ممتاز!",
    ytd_tip_excellent: (avg) => `أداء سنوي ممتاز! متوسطك ${avg.toFixed(1)} — أنت في قمة الأداء.`,
    ytd_tip_good_title: "أداء جيد",
    ytd_tip_good: (avg) => `أداء جيد لكن في مجال للتحسين. متوسطك ${avg.toFixed(1)}/100.`,
    ytd_tip_low_title: "محتاج تطوير",
    ytd_tip_low: (avg) => `متوسط أدائك السنوي ${avg.toFixed(1)} — ركّز على المنتجات الأضعف.`,
    ytd_tip_best_title: "أفضل شهر",
    ytd_tip_best: (m, s) => `أفضل شهر كان ${m} بدرجة ${s.toFixed(1)} — كرر نفس الأسلوب!`,
    ytd_tip_worst_title: "شهر يحتاج مراجعة",
    ytd_tip_worst: (m, s) => `شهر ${m} كان الأضعف (${s.toFixed(1)}) — راجع ما حصل لتتجنّبه.`,

    months_full: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
    months_short: ["ينا","فبر","مار","أبر","ماي","يون","يول","أغس","سبت","أكت","نوف","ديس"],

    unit_count: "عدد",
    unit_thousands_egp: "ألف ج.م",
    unit_percent: "%",

    pdf_report_title: "تقرير الأداء الشهري",
    pdf_overall_label: "درجة الأداء الكلية",
    pdf_overall_of: "من 100 درجة",
    pdf_products_section: "تفاصيل المنتجات",
    pdf_th_product: "المنتج",
    pdf_th_target: "المستهدف",
    pdf_th_achieved: "المحقق",
    pdf_th_pct: "النسبة",
    pdf_th_weighted: "الدرجة المرجحة",
    pdf_tips_title: "🧠 النصائح الذكية",
    pdf_ytd_title: "📅 ملخص العام حتى الآن",
    pdf_ytd_avg: "متوسط الأداء",
    pdf_ytd_best: "أفضل شهر",
    pdf_ytd_worst: "أضعف شهر",
    pdf_ytd_th_month: "الشهر",
    pdf_ytd_th_score: "درجة الأداء",
    pdf_export_label: "تصدير"
  },

  en: {
    brand_title: "Target Pro",
    brand_subtitle: "Bank targets tracker",

    tab_dashboard: "📊 Dashboard",
    tab_targets: "🎯 Targets",
    tab_achieved: "✅ Achievement",
    tab_settings: "⚙️ Settings",

    common_save: "Save",
    common_cancel: "Cancel",
    common_delete: "Delete",
    common_add: "Add",
    common_edit: "Edit",
    common_back_today: "↩ Back to today",
    common_loading: "Loading…",
    common_yes: "Yes",
    common_no: "No",

    prev_month: "Previous month",
    next_month: "Next month",
    online: "Online",

    welcome_title: "Target Pro",
    welcome_subtitle: "Professional bank targets tracker — all data stored locally on your device",
    welcome_name_ph: "Your full name",
    welcome_job_ph: "Your job title",
    welcome_start: "Get started 🚀",

    splash_subtitle: "Professional bank targets tracker",
    install_msg: "📲 Install the app on your home screen",
    install_install: "Install now",
    install_later: "Later ✕",

    loading_data: "Loading your data…",

    hero_heading_excellent: "🏆 You beat the target!",
    hero_heading_on_track: "🚀 On track",
    hero_heading_keep_going: "💪 Keep going, push harder",
    hero_heading_start_pushing: "⚡ Time to push now",
    hero_kpi_score: "Performance score",
    hero_kpi_best: "Top product",
    hero_kpi_worst: "Needs work",
    hero_kpi_days_left: "Days left",

    ring_label: "Score / 100",

    product_card_target: "Target",
    product_card_achieved: "Done",
    product_card_weight: "Weight",

    compare_title: "📈 Achievement % per product",
    compare_y_label: "%",
    compare_tooltip_pct: "Achievement",

    tips_title: "🧠 Smart tips",
    tips_badge: "Personalized",

    ytd_title: "📅 Year-to-date performance",
    ytd_avg: "YTD average score",
    ytd_best_month: "Best month",
    ytd_worst_month: "Worst month",
    ytd_months_with_data: "Months with data",
    ytd_table_product: "Product",
    ytd_table_avg_pct: "Avg achievement %",
    ytd_table_weight: "Weight",
    ytd_table_weighted: "Weighted score",

    dash_export: "📄 Export PDF",
    dash_exporting: "⏳ Exporting…",

    targets_title: (m) => `🎯 Targets for ${m}`,
    targets_hint: "Enter your monthly target for each product. Saved instantly to your device.",
    targets_placeholder: "Enter target",
    targets_save: "💾 Save targets",

    ach_today_title: (d) => `✅ Today's entry — ${d}`,
    ach_pastday_title: (d) => `✅ Edit past day — ${d}`,
    ach_today_hint: "Enter only what you achieved today per product (not cumulative). Totals are calculated automatically.",
    ach_pastday_hint: "Pick a past day from the current month to edit or add its entry.",
    ach_date_label: "Entry date",
    ach_back_today: "↩ Back to today",
    ach_input_today_ph: "Amount achieved today",
    ach_input_pastday_ph: "Amount achieved on this day",
    ach_month_target: (n, u) => `Monthly target: ${n} ${u}`,
    ach_save_today: "💾 Save today's entry",
    ach_update_pastday: "💾 Update this day",
    ach_add_pastday: "💾 Add this day",
    ach_history_title: "📋 Last 10 days log",
    ach_history_empty: "No entries logged yet for this month",
    ach_history_th_date: "Date",
    ach_history_th_pct: "Achievement %",
    ach_delete_confirm: (d) => `Delete entry for ${d}?`,

    cum_title: (m) => `✅ Log achievement — ${m}`,
    cum_hint: "Past months store the cumulative total achieved per product.",
    cum_placeholder_with_target: (n, u) => `Out of ${n} ${u}`,
    cum_placeholder_no_target: "No target set",
    cum_save: "💾 Save achievements",

    settings_products_title: "⚙️ Product management",
    settings_products_hint: "Add, edit, or delete products. The sum of weights must equal 100%.",
    settings_total_weight: "Total weight",
    settings_total_must_be_100: "must equal 100%",
    settings_add_product: "➕ Add new product",
    settings_save_changes: "💾 Save changes",
    settings_form_name: "Name",
    settings_form_short: "Short name",
    settings_form_short_ph: "Max 6 chars",
    settings_form_emoji: "Emoji",
    settings_form_unit: "Unit",
    settings_form_weight: "Weight %",
    settings_form_color: "Color",
    settings_form_save: "➕ Add",
    settings_form_cancel: "Cancel",
    settings_delete_confirm: (n) => `Delete ${n}? Current-month data for this product will be erased. Are you sure?`,
    settings_name_short_required: "Name and short name are required",
    settings_employee_title: "👤 Your profile",
    settings_employee_hint: "Update your name or job title.",
    settings_employee_name: "Name",
    settings_employee_job: "Job title",
    settings_employee_save: "💾 Save my info",
    settings_employee_required: "Name and job title are required",

    toast_targets_saved: "Targets saved successfully ✅",
    toast_ach_saved: "Achievements updated successfully ✅",
    toast_daily_saved: "Today's entry saved ✅",
    toast_deleted: "Deleted",
    toast_products_saved: "Products saved ✅",
    toast_employee_saved: "Profile updated ✅",
    toast_pdf_ok: "Report exported ✅",
    toast_pdf_err: "Export failed, please try again",

    footer_text: "Target Pro — data stored locally on your device | no server, no login",
    developer_credit: "Developed by MOHAMED SAYED",

    bn_dashboard: "Home",
    bn_targets: "Targets",
    bn_achieved: "Done",
    bn_settings: "Settings",

    view_ytd: "📈 Year to date",

    ytd_hero_label: "Average score / 100",
    ytd_kpi_avg: "YTD avg",
    ytd_kpi_best: "Best month",
    ytd_kpi_worst: "Worst month",
    ytd_kpi_logged: "Months logged",
    ytd_chart_title: "📊 Monthly performance across the year",
    ytd_table_title: "📋 Yearly product breakdown",
    ytd_tips_title: "🧠 Yearly insights",
    ytd_empty: "No data logged this year yet",

    ytd_tip_excellent_title: "Excellent yearly performance!",
    ytd_tip_excellent: (avg) => `Excellent yearly performance! Your average is ${avg.toFixed(1)} — you're at peak performance.`,
    ytd_tip_good_title: "Good performance",
    ytd_tip_good: (avg) => `Good performance with room to improve. Your average is ${avg.toFixed(1)}/100.`,
    ytd_tip_low_title: "Needs improvement",
    ytd_tip_low: (avg) => `Your yearly average is ${avg.toFixed(1)} — focus on the weakest products.`,
    ytd_tip_best_title: "Best month",
    ytd_tip_best: (m, s) => `Your best month was ${m} with score ${s.toFixed(1)} — repeat that approach!`,
    ytd_tip_worst_title: "Month to review",
    ytd_tip_worst: (m, s) => `${m} was the weakest (${s.toFixed(1)}) — review what happened to avoid it.`,

    months_full: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    months_short: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],

    unit_count: "count",
    unit_thousands_egp: "K EGP",
    unit_percent: "%",

    pdf_report_title: "Monthly performance report",
    pdf_overall_label: "Overall performance score",
    pdf_overall_of: "out of 100",
    pdf_products_section: "Product details",
    pdf_th_product: "Product",
    pdf_th_target: "Target",
    pdf_th_achieved: "Achieved",
    pdf_th_pct: "Percent",
    pdf_th_weighted: "Weighted score",
    pdf_tips_title: "🧠 Smart tips",
    pdf_ytd_title: "📅 Year-to-date summary",
    pdf_ytd_avg: "Average score",
    pdf_ytd_best: "Best month",
    pdf_ytd_worst: "Worst month",
    pdf_ytd_th_month: "Month",
    pdf_ytd_th_score: "Score",
    pdf_export_label: "Exported"
  }
};

export interface TipPack {
  no_target: { title: string; text: string }[];
  exceed: (pct: number) => string;
  on_track: (delta: number, remaining: number) => string;
  needs_speed: (gap: string, remaining: number) => string;
  average: (gap: string) => string;
  focus_on: (name: string, pct: number, weight: number) => string;
  strength: (name: string, pct: number) => string;
  zero_hour: (remaining: number, score: number) => string;
  extras: { icon: string; title: string; text: string }[];
  titles: {
    exceed: string;
    on_track: string;
    needs_speed: string;
    average: string;
    focus_on: (name: string) => string;
    strength: (name: string) => string;
    zero_hour: string;
  };
}

export const tipsDict: Record<Lang, TipPack> = {
  ar: {
    no_target: [
      { title: "ابدأ بتحديد مستهدفاتك", text: "انتقل لتبويب «المستهدفات» وأدخل هدف كل منتج عشان نبدأ نتابع معك ونقدملك نصايح مخصصة." },
      { title: "أسهل عميل في البنك", text: "عملاء الشهادات المنتهية هم الأسهل تحويلاً — اطلب قائمتهم من مديرك وابدأ بيهم." }
    ],
    exceed: (pct) => `درجة أداء استثنائية: ${pct.toFixed(1)}/100. استغل الزخم ده وحاول تكسر رقم قياسي — مديرك بيلاحظ.`,
    on_track: (delta, remaining) => `درجتك أحسن من المتوقع بـ ${delta.toFixed(0)} نقطة، باقي ${remaining} يوم. كمّل بنفس الوتيرة.`,
    needs_speed: (_gap, remaining) => `أداؤك أقل من المتوقع. باقي ${remaining} يوم — لازم تضغط على المنتجات الأعلى وزناً أولاً.`,
    average: (_gap) => `أداء متوسط. زيادة تواصلاتك اليومية بـ 3 عملاء هتفرق كبير في نهاية الشهر.`,
    focus_on: (_name, pct, weight) => `ده أضعف منتج بنسبة ${pct.toFixed(0)}% وبيساهم بـ ${weight}% من درجتك. خصص ليه أول 30 دقيقة من يوم شغلك كل يوم.`,
    strength: (name, pct) => `حققت ${pct.toFixed(0)}% في ${name}. شارك الأسلوب ده مع زملائك وحاول تطبقه على المنتجات الأضعف.`,
    zero_hour: (remaining, score) => `باقي ${remaining} أيام بس ودرجتك ${score.toFixed(1)}/100! اتصل بكل عميل VIP دلوقتي.`,
    extras: [
      { icon: "📱", title: "الواتساب أداة إغلاق", text: "بعد كل اجتماع أرسل ملخص العرض على الواتساب. العميل بيراجعه في الليل ويوافق في الصبح." },
      { icon: "🎁", title: "بيع منتجين دفعة واحدة", text: "كل عميل قرض هو فرصة شهادة، وكل عميل شهادة هو فرصة بطاقة. دايماً اعرض منتج تاني." },
      { icon: "⏰", title: "وقت التواصل الأمثل", text: "أفضل وقت لتواصل العملاء: 10 الصبح أو 4 المساء. تجنب وقت الغداء وأول الصبح الباكر." }
    ],
    titles: {
      exceed: "تجاوزت المستهدف!",
      on_track: "في المسار الصح!",
      needs_speed: "تحتاج تسرّع!",
      average: "أداء متوسط — وقت تضغط",
      focus_on: (name) => `ركز على ${name}`,
      strength: (name) => `${name} — نقطة قوتك!`,
      zero_hour: "ساعة الصفر!"
    }
  },

  en: {
    no_target: [
      { title: "Start by setting targets", text: "Go to the Targets tab and enter a goal for each product so we can track and give you personalized tips." },
      { title: "Easiest client in the bank", text: "Customers with maturing certificates are the easiest to convert — ask your manager for the list and start there." }
    ],
    exceed: (pct) => `Exceptional score: ${pct.toFixed(1)}/100. Ride the momentum and aim for a record — your manager notices.`,
    on_track: (delta, remaining) => `You're ${delta.toFixed(0)} points ahead of pace with ${remaining} days left. Keep the same rhythm.`,
    needs_speed: (_gap, remaining) => `You're below pace. With ${remaining} days left, focus on the highest-weighted products first.`,
    average: (_gap) => `Average pace. Adding 3 more daily client conversations will make a real difference by month end.`,
    focus_on: (_name, pct, weight) => `Weakest product at ${pct.toFixed(0)}% — contributes ${weight}% of your score. Give it the first 30 minutes of your day.`,
    strength: (name, pct) => `You hit ${pct.toFixed(0)}% on ${name}. Share that approach with teammates and apply it to weaker products.`,
    zero_hour: (remaining, score) => `Only ${remaining} days left and your score is ${score.toFixed(1)}/100! Call every VIP client now.`,
    extras: [
      { icon: "📱", title: "WhatsApp is your closer", text: "After every meeting, send a summary on WhatsApp. Clients review at night and approve in the morning." },
      { icon: "🎁", title: "Bundle two products", text: "Every loan client is a certificate opportunity, and vice versa. Always offer a second product — more than half accept." },
      { icon: "⏰", title: "Best contact times", text: "Reach clients at 10 AM or 4 PM. Avoid lunch hours and very early mornings." }
    ],
    titles: {
      exceed: "Target exceeded!",
      on_track: "On the right track!",
      needs_speed: "Need to speed up!",
      average: "Average pace — time to push",
      focus_on: (name) => `Focus on ${name}`,
      strength: (name) => `${name} — your strength!`,
      zero_hour: "Zero hour!"
    }
  }
};
