////nave bar///////
 const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('show');
  });

  ///////////////////////////////////////////////////



  /////////EMAILJS//////////////

  // تهيئة EmailJS
  (function () {
    emailjs.init("IbbG69TuO-Uyx_4I8"); // 🟢 ضع الـ User ID الخاص بك من EmailJS
  })();

  // إضافة التاريخ الحالي داخل الحقل المخفي
  document.addEventListener('DOMContentLoaded', () => {
    const now = new Date().toLocaleString();
    document.getElementById('time').value = now;
  });

  // إرسال النموذج عبر EmailJS
  document.querySelector('.contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    emailjs.sendForm('service_9a47m0s', 'template_vlo4ub3', this)
      .then(function () {
        alert('✅ رسالتك أُرسلت بنجاح!');
        event.target.reset();
      }, function (error) {
        alert('❌ حدث خطأ أثناء الإرسال:\n' + JSON.stringify(error));
      });
  });