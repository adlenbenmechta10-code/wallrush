# 🚀 دليل النشر على المتاجر — WallRush v1.1.0

> من الكود إلى **Google Play** و **App Store** — خطوة بخطوة، بدون خبرة سابقة.

---

## 📦 ما يوجد في هذا المستودع

| الملف / المجلد | الوظيفة |
|---|---|
| `index.html` | اللعبة كاملة (ملف واحد — تعمل مباشرة في أي متصفح) |
| `manifest.webmanifest` + `sw.js` + `icons/` | تحويل اللعبة إلى PWA قابلة للتثبيت وتعمل دون اتصال |
| `package.json` + `capacitor.config.json` | مشروع **Capacitor** لتوليد تطبيق Android/iOS أصلي |
| `scripts/prepare-www.mjs` | ينسخ اللعبة إلى `www/` قبل بناء التطبيق |
| `assets/` | الأيقونة المصدر (1024) + شاشة البداية (2732) |
| `screenshots/android/` + `screenshots/ios/` | 8 لقطات شاشة جاهزة للمتاجر لكل منصة (أندرويد 1080×2400، آيفون 6.3″ 1206×2622) |
| `store/listing-*.md` | نصوص المتجر الجاهزة (عربي/إنجليزي/5 لغات أخرى) |
| `privacy-policy.html` | سياسة الخصوصية (مطلوبة من المتجرين) |

---

## ✅ الخطوة 0 — المتطلبات

**للنشر على Google Play:**
- حساب Google Play Developer (رسم لمرة واحدة **25$**) → [play.google.com/console](https://play.google.com/console)
- مطلوب للبناء: **Node.js 18+** و **Android Studio** (سيثبّت JDK و Android SDK تلقائياً)

**للنشر على App Store:**
- حساب Apple Developer (**99$/سنة**) → [developer.apple.com](https://developer.apple.com)
- مطلوب للبناء: **Mac** مع **Xcode 15+**

> 💡 لا يوجد Mac؟ يمكنك بناء نسخة iOS عبر خدمات CI مثل Codemagic، لكن الأسهل البدء بـ Android.

---

## 🌐 الخطوة 1 — فعّل النسخة الويب (GitHub Pages)

النسخة الويب مفيدة كرابط تجريبي + لاستضافة سياسة الخصوصية:

1. ادخل إلى المستودع على GitHub → **Settings → Pages**
2. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)` → **Save**
3. بعد دقيقة ستحصل على: `https://adlenbenmechta10-code.github.io/wallrush/`
4. رابط سياسة الخصوصية للمتاجر:
   `https://adlenbenmechta10-code.github.io/wallrush/privacy-policy.html`

---

## 🤖 الخطوة 2 — بناء تطبيق Android (APK/AAB)

### 2.1 التجهيز (مرة واحدة)

```bash
# في مجلد المستودع
npm install          # يثبّت Capacitor والمكوّنات
npm run add:android  # ينشئ مجلد android/ كاملاً
```

### 2.2 توليد كل الأيقونات وأيقونات التطبيق

```bash
npm run assets       # يولّد كل مقاسات أيقونات Android/iOS من assets/
```

### 2.3 تثبيت الشاشة العمودية (portrait)

افتح `android/app/src/main/AndroidManifest.xml` وأضف داخل وسم `<activity>`:

```xml
android:screenOrientation="portrait"
```

### 2.4 البناء

**الطريقة السهلة (واجهة رسومية):**
```bash
npm run open:android   # يفتح Android Studio
# ثم: Build → Generate Signed Bundle / APK → Android App Bundle
```

**أولاً ستحتاج "مفتاح توقيع" (Keystore) — أنشئه مرة واحدة واحفظه بأمان:**
- في Android Studio: Build → Generate Signed Bundle → **Create new...**
- Key store path: احفظه خارج المستودع (مثلاً `D:/keys/wallrush.jks`)
- كلمة مرور قوية + alias مثل `wallrush` → ستحتاجها في كل تحديث!
- ⚠️ **فقدان المفتاح = استحالة تحديث التطبيق** — انسخه احتياطياً (Google Drive مثلاً)

**الطريقة من سطر الأوامر:**
```bash
cd android
./gradlew bundleRelease   # ينتج app/release/app-release.aab
```

### 2.5 رفع على Google Play

1. [Play Console](https://play.google.com/console) → **Create app**
   - Name: `WallRush — Wall Race` • Language: العربية أو English • Free
2. **Store listing**: الصق النصوص من `store/listing-ar-en.md`، ارفع:
   - App icon: `icons/icon-512.png`
   - Feature graphic: 1024×500 (يمكن توليدها من الأيقونة مع خلفية كريمية)
   - Screenshots: ملفات `screenshots/android/` (8 لقطات: اللغات، الحساب، الرئيسية، اللعب، اللاعبون، الفوز، معاينة الجدار، كيف تلعب)
   - أضف لغات أخرى من `store/listing-more.md`
3. **App content** (كلها سهلة لأن اللعبة لا تجمع بيانات):
   - Privacy policy URL: رابط Pages من الخطوة 1
   - Ads: **No ads**
   - Content rating: لعبة لوحية → **Everyone / 3+**
   - Data safety: **No data collected, No data shared** (صحيح 100%)
   - Target audience: 13+ (أو 18+، أو Everyone — كلها مقبولة)
4. **Production** → Create release → ارفع ملف `.aab` → Submit for review
5. المراجعة تستغرق عادة **من ساعات إلى 3 أيام** للتطبيق الأول

---

## 🍎 الخطوة 3 — بناء تطبيق iOS

```bash
npm install        # إن لم يكن مثبتاً
npm run add:ios    # ينشئ مجلد ios/
npm run assets     # أيقونات iOS
npm run open:ios   # يفتح Xcode
```

في Xcode:
1. حدد الـ Target → **Signing & Capabilities** → فريق Apple Developer الخاص بك
   - Bundle ID: `com.adlenbenmechta.wallrush` (يجب أن يكون فريداً عالمياً)
2. تحقق من: General → **iPhone Only** + Portrait
3. Product → **Archive** → Distribute App → App Store Connect

في [App Store Connect](https://appstoreconnect.apple.com):
1. My Apps → **+ New App** → Name: `WallRush` → Bundle ID من Xcode
2. املأ البيانات من `store/listing-ar-en.md` + ارفع لقطات `screenshots/ios/` (8 لقطات بنفس الترتيب)
3. App Privacy → **No Data Collected**
4. Age Rating → لا عنف، لا مقامرة، لا محتوى → 4+
5. Build → اختر الأرشيف المرفوع → **Submit for Review**
6. المراجعة عادة **24-48 ساعة**

> ملاحظة Apple 4.2 (الحد الأدنى من الوظائف): لعبة لوحية كاملة مع ذكاء اصطناعي و8 لغات وحسابات لاعبين محلية وأوضاع متعددة تتجاوز هذا الشرط بسهولة.

---

## 🛡️ قائمة الفحص قبل الإرسال (لتفادي الرفض)

- [ ] رقم الإصدار محدّث في `package.json` و `index.html` (سطر `menuVersion`) مع كل تحديث
- [ ] الأيقونة 512×512 بدون شفافية ✓ (`icons/icon-512.png`)
- [ ] سياسة الخصوصية على رابط HTTPS يعمل ✓
- [ ] اختبرت APK على جهاز حقيقي: كل اللغات الثمانية، زر الرجوع، الاهتزاز، الأوضاع الثلاثة
- [ ] بيانات Data Safety متطابقة مع الواقع: **لا تُجمع أي بيانات**
- [ ] لا يوجد ذكر لـ "Beta" أو "تجريبي" في أي مكان
- [ ] لقطات الشاشة من الإصدار النهائي وليست قديمة

---

## 🔄 كيف تحدّث اللعبة لاحقاً؟

1. عدّل `index.html` وارفع إلى GitHub (النسخة الويب تتحدث فوراً)
2. ارفع **رقم الإصدار**: في `package.json` (مثل 1.2.0) وفي `menuVersion` داخل `index.html` وفي `sw.js` (اسم الكاش)
3. كرر خطوات البناء والرفع — **بنفس مفتاح التوقيع** دائماً


## v1.3.0 — مستوى Blocade (ترقية كبيرة)

### المزايا الجديدة
1. **وضع الجدران الاحترافي**: سحب وإفلات مع توجيه حي، معاينة عند مرور المؤشر، مؤشرات + للنقاط المتاحة، سقوط متحرك للجدار مع أغطية بلون صاحبه، وعداد أثر المسار (مسافتي · مسافة خصمي) أثناء التوجيه.
2. **عدّاد الخطوات** لكل لاعب في الشريط العلوي (يتحدث لحظياً).
3. **وضع الألغاز**: لغز الجدار + لغز السباق، مولّدة إجرائياً ومضمونة الحل، مع تلميح/إعادة/محاولات.
4. **تحدي اليوم**: 3 ألغاز يومية ببذرة التاريخ + عدّاد تنازلي + سلسلة أيام.
5. **سلّم الروبوتات**: 8 روبوتات متدرجة + تقييم ELO (K=24) + 6 رتب من ورقي إلى ماسي.
6. **ترتيب النادي**: جدول متصدرين محلي (أنت + الروبوتات).
7. صعوبة **خبير** جديدة للذكاء الاصطناعي (بحث عمق 4).
8. إصلاحات: منع اللعب أثناء الإيقاف المؤقت، إنهاء لغز الجدار فور حلّه (منع الحل المتكرر)، حماية أنيميشن السقوط من الطوابع الزمنية الشاذة.

### ملاحظات المتجر
- حدّث نصوص الوصف في المتاجر لذكر: الألغاز، التحدي اليومي، سلّم الروبوتات، التقييم.
- لقطات الشاشة الجديدة في `screenshots/` (أُعيد توليدها من v1.3.0).
- الإصدار: 1.3.0 في package.json و manifest.webmanifest.
