////nave bar///////
 const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('show');
  });

  ///////////////////////////////////////////////////



  /////////EMAILJS//////////////

// تهيئة EmailJS
(function() {
  emailjs.init("IbbG69TuO-Uyx_4I8"); // استبدل بمفتاحك العام من EmailJS
})();

// إرسال النموذج عبر EmailJS
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm("service_9a47m0s", "template_vlo4ub3", this) // عدل حسب الخدمة والقالب الخاصين بك
    .then(function(response) {
      document.getElementById("status-message").textContent = "✅ Message sent successfully!";
    }, function(error) {
      document.getElementById("status-message").textContent = "❌ Failed to send message.";
    });

  this.reset();
});

// تعريف المتغيرات لعناصر المودال والزر
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const closeBtn = document.querySelector('.close');

// فتح المودال عند الضغط على زر الاتصال (إذا موجود)
if(contactBtn){
  contactBtn.addEventListener('click', () => {
    contactModal.style.display = 'flex';
  });
}

// غلق المودال عند الضغط على زر الإغلاق
closeBtn.addEventListener('click', () => {
  contactModal.style.display = 'none';
});

// غلق المودال عند الضغط خارج نافذة المودال
window.addEventListener('click', (event) => {
  if (event.target === contactModal) {
    contactModal.style.display = 'none';
  }
});
