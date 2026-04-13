# منصة أوقاف مدكر

واجهة عربية مبنية بـ **Tailwind CSS** لتوجيه الراغب بالوقف عبر رحلة تفاعلية ثرية (مراحل + بطاقات خيارات + ملخص حي)، ثم إصدار رقم طلب ومتابعته عبر Supabase.

## المسارات المدعومة
- مبلغ أكبر من مليون ريال لشراء أصل وتحويله إلى وقف.
- أصل قائم يريد صاحبه تحويله إلى وقف.
- وقف قائم يريد صاحبه نقل النظارة للجمعية.
- مساهمة أقل من مليون ريال في وقف قيد الإنشاء.

## 1) إعداد قاعدة البيانات في Supabase
1. افتح مشروع Supabase.
2. انتقل إلى `SQL Editor`.
3. نفّذ ملف [`supabase/schema.sql`](./supabase/schema.sql).

## 2) إعداد الواجهة
1. افتح ملف [`config.js`](./config.js).
2. ضع القيم التالية:
- `supabaseUrl`: رابط المشروع.
- `supabaseAnonKey`: مفتاح `anon public`.

> ملاحظة: `config.js` مناسب للتجربة المحلية. في Vercel يفضّل استخدام Environment Variables كما في القسم التالي.

## 3) ربط Supabase مع Vercel
1. ارفع المشروع على GitHub.
2. استورده داخل Vercel.
3. من إعدادات المشروع في Vercel أضف متغيرات البيئة:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
4. أعد النشر (Redeploy).

الواجهة ستقرأ القيم تلقائيًا من endpoint:
- `/api/config`

## 4) تشغيل محلي
يمكن فتح `index.html` مباشرة، أو تشغيل أي سيرفر ثابت مثل:

```bash
python3 -m http.server 8080
```

ثم زيارة:
- `http://localhost:8080`

## ملاحظات تشغيلية
- الواجهة تعتمد على Tailwind عبر CDN (لا تحتاج بناء Build محلي).
- في Vercel تم إضافة function في [`api/config.js`](./api/config.js) لتمرير إعدادات Supabase من Environment Variables.
- إنشاء الطلب يتم عبر RPC: `create_waqf_request`.
- المتابعة برقم الطلب تتم عبر RPC: `track_waqf_request`.
- رقم الطلب يصدر من السيرفر بصيغة:
  - `MDK-WQF-YYYYMMDD-XXXXXX`

## تطوير لاحق مقترح
- لوحة موظف داخلية لتحديث `status` و`timeline` من لوحة الإدارة.
- إرسال إشعار SMS/WhatsApp عند تغيير حالة الطلب.
