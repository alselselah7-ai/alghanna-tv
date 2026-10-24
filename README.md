# مزامنة قوائم يوتيوب

## الإعداد (مرة واحدة)
1. في Google Cloud: أنشئ مشروعًا وفعّل **YouTube Data API v3** وأنشئ API key.
2. قيّد المفتاح بالـ API المذكور (وبعنوان IP الخادم إن أمكن).
3. اضبط `YOUTUBE_API_KEY` في بيئة الخادم فقط (لا تضعه في HTML أو في المستودع).

## التشغيل اليدوي
    YOUTUBE_API_KEY=... node sync-playlists.mjs --html ../alghanna-tv.html

## التصنيف والتعديل
- `playlists.json`: غيّر `section` إلى اسم قسم موجود (مثل "الدروس والمجالس العلمية")، أو `hidden: true` للإخفاء.
- القوائم غير المصنّفة تظهر في قسم "برامج القناة". التصنيف لا يُمسح عند إعادة المزامنة.

## مزامنة دورية (مثال cron كل 6 ساعات)
    0 */6 * * * cd /path/youtube-sync && YOUTUBE_API_KEY=... node sync-playlists.mjs --html ../alghanna-tv.html
تكلفة كل مزامنة نحو 3 وحدات من حصة 10,000 يوميًا.
