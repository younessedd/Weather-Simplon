document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // استعادة الوضع المحفوظ من localStorage
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️'; // أيقونة النهار عند التفعيل
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙'; // أيقونة القمر للوضع الفاتح
  }

  // حدث النقر على زر التبديل
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = '☀️'; // أيقونة النهار
    } else {
      localStorage.setItem('theme', 'light');
      themeToggle.textContent = '🌙'; // أيقونة القمر
    }
  });
});
