// الانتظار حتى يتم تحميل محتوى الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
  
  // جلب زر التبديل حسب المعرف theme-toggle
  const themeToggle = document.getElementById('theme-toggle');
  
  // إذا لم يكن الزر موجودًا، نوقف تنفيذ الكود
  if (!themeToggle) return;

  // استعادة إعداد الثيم (الوضع) المحفوظ في localStorage
  if (localStorage.getItem('theme') === 'dark') {
    // إذا كان الثيم "داكن"، نضيف الصنف 'dark' إلى عنصر body
    document.body.classList.add('dark');
    // تغيير أيقونة الزر إلى رمز الشمس (وضع النهار)
    themeToggle.textContent = '☀️';
  } else {
    // إذا لم يكن الثيم داكنًا، نتأكد من إزالة الصنف 'dark'
    document.body.classList.remove('dark');
    // تغيير أيقونة الزر إلى رمز القمر (وضع الليل)
    themeToggle.textContent = '🌙';
  }

  // إضافة حدث نقر على زر التبديل لتغيير الثيم عند الضغط عليه
  themeToggle.addEventListener('click', () => {
    // تبديل الصنف 'dark' على عنصر body (تفعيل/إلغاء الوضع الداكن)
    document.body.classList.toggle('dark');

    // تحقق من وجود الصنف 'dark' لتحديث الإعدادات وأيقونة الزر
    if (document.body.classList.contains('dark')) {
      // حفظ إعداد الوضع الداكن في localStorage
      localStorage.setItem('theme', 'dark');
      // تعيين أيقونة الزر إلى الشمس للدلالة على تفعيل الوضع الداكن
      themeToggle.textContent = '☀️';
    } else {
      // حفظ إعداد الوضع الفاتح في localStorage
      localStorage.setItem('theme', 'light');
      // تعيين أيقونة الزر إلى القمر للدلالة على الوضع الفاتح
      themeToggle.textContent = '🌙';
    }
  });

});
