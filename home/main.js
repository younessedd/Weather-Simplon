// === 1. التحكم في القائمة الجانبية (Navbar Toggle) ===
const toggle = document.querySelector('.menu-toggle'); // نحصل على زر القائمة الجانبية (زر التبديل)
const nav = document.querySelector('nav');             // نحصل على عنصر التنقل <nav> الذي نريد إظهار/إخفاءه

// نضيف مستمع حدث للزر عند الضغط عليه
toggle.addEventListener('click', (event) => {
  nav.classList.toggle('show');  // نضيف أو نحذف كلاس "show" لإظهار أو إخفاء القائمة
  event.stopPropagation();       // نمنع الحدث من الانتشار لأعلى DOM لتجنب إغلاق القائمة مباشرة بعد فتحها
});

// نضيف مستمع حدث للنقر على الصفحة كاملة
document.addEventListener('click', (event) => {
  // إذا كانت القائمة مفتوحة (تحتوي على كلاس show)
  // والنقرة كانت خارج القائمة أو زر التبديل
  if (nav.classList.contains('show') && 
      !nav.contains(event.target) && 
      !toggle.contains(event.target)) {
    nav.classList.remove('show'); // نزيل الكلاس لإغلاق القائمة
  }
});


/* ----------------------------------------------------------------------------- */

// === 2. تعريف المتغيرات العامة لعناصر الطقس ===
const API_KEY = '7686dcb2ae254b8970f31a18c2521290'; // مفتاح API لواجهة OpenWeatherMap

// جلب العناصر من الـ DOM لاستخدامها لاحقًا
const cityInput = document.getElementById('city-input');           // حقل إدخال اسم المدينة من المستخدم
const searchBtn = document.getElementById('search-btn');           // زر البحث
const cityName = document.getElementById('city-name');             // عنصر لعرض اسم المدينة الحالي
const temperature = document.getElementById('temperature');        // عنصر عرض درجة الحرارة
const weatherDescription = document.getElementById('weather-description'); // وصف حالة الطقس (مثلاً: غائم)
const weatherIcon = document.querySelector('#weather-icon i');     // عنصر أيقونة الطقس (رمز بصري)
const humidity = document.getElementById('humidity');              // عنصر عرض نسبة الرطوبة
const wind = document.getElementById('wind');                      // عنصر عرض سرعة الرياح
const pressure = document.getElementById('pressure');              // عنصر عرض الضغط الجوي
const unitBtns = document.querySelectorAll('.unit-btn');           // جميع أزرار تغيير الوحدة (°C أو °F)
const themeToggle = document.getElementById('theme-toggle');       // زر تبديل الوضع الليلي/النهاري
const hourlyForecast = document.getElementById('hourly-forecast'); // حاوية التوقعات الساعية
const dailyForecast = document.getElementById('daily-forecast');   // حاوية التوقعات اليومية
const unitElement = document.getElementById('unit');               // عنصر عرض الوحدة الحالية (مثلاً: °C)

// تعريف المتغيرات لتخزين الوحدة الحالية والمدينة الحالية
let currentUnit = 'metric';  // الوحدة الافتراضية (مترية = درجة مئوية)
let currentCity = '';        // اسم المدينة الذي يعرض حالياً


// === 3. عند تحميل الصفحة: محاولة الحصول على موقع المستخدم ===
document.addEventListener('DOMContentLoaded', () => {
  if (navigator.geolocation) {  // التأكد من دعم المتصفح لخدمة الموقع الجغرافي
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {   // عند النجاح نحصل على الإحداثيات (خط العرض والطول)
        await getWeatherByCoords(coords.latitude, coords.longitude); // جلب الطقس حسب الإحداثيات
      },
      async () => {              // عند الفشل أو رفض المستخدم
        await getWeatherByCity('Casablanca'); // عرض الطقس لكازابلانكا كخيار افتراضي
      }
    );
  } else {                     // إذا لم يدعم المتصفح الجيولكاشن
    getWeatherByCity('Casablanca'); // نستخدم كازابلانكا افتراضياً
  }
});

// === 4. عند الضغط على زر البحث يتم تنفيذ دالة البحث ===
searchBtn.addEventListener('click', searchWeather);

// === 5. عند الضغط على زر Enter داخل حقل الإدخال يتم تنفيذ البحث ===
cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchWeather(); // إذا كان مفتاح Enter نبدأ البحث
});

// === 6. تغيير الوحدة (مترية أو فهرنهايت) عند الضغط على أزرار الوحدة ===
unitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    unitBtns.forEach(b => b.classList.remove('active')); // إزالة التفعيل من جميع الأزرار
    btn.classList.add('active');                          // تفعيل الزر الذي تم الضغط عليه
    currentUnit = btn.dataset.unit;                       // تحديث قيمة الوحدة (metric أو imperial)
    unitElement.textContent = currentUnit === 'metric' ? '°C' : '°F'; // تحديث عرض الوحدة على الصفحة
    if (currentCity) getWeatherByCity(currentCity);      // إعادة تحميل الطقس للمدينة الحالية بوحدة جديدة
  });
});

// === 7. تبديل الوضع الليلي والنهاري عند الضغط على زر الثيم ===
themeToggle.addEventListener('click', toggleTheme);


// === 8. دالة البحث عن الطقس حسب اسم المدينة المدخل ===
async function searchWeather() {
  const city = cityInput.value.trim();  // إزالة الفراغات الزائدة من الإدخال
  if (city) {
    await getWeatherByCity(city);        // جلب بيانات الطقس للمدينة
    cityInput.value = '';                // إعادة تعيين الحقل بعد البحث
  }
}

// === 9. دالة لجلب اسم المكان بناءً على إحداثيات خط العرض والطول (العكس) ===
async function getPlaceName(lat, lon) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  try {
    const res = await fetch(url);       // طلب جلب بيانات اسم المكان من API
    const data = await res.json();      // تحويل الاستجابة إلى JSON
    if (data.length === 0) return null; // إذا لم يوجد نتائج نرجع null
    return data[0];                     // نرجع أول نتيجة (معلومات الاسم، الولاية، الدولة)
  } catch {
    return null;                       // في حالة وجود خطأ نرجع null
  }
}

// === 10. جلب الطقس حسب إحداثيات الموقع ===
async function getWeatherByCoords(lat, lon) {
  try {
    showLoading(true);                  // عرض مؤشر التحميل أثناء جلب البيانات

    const place = await getPlaceName(lat, lon); // جلب اسم المكان
    showMap(lat, lon ,'fr');                 // عرض الخريطة مع الموقع الحالي

    // جلب بيانات الطقس الحالية من API
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}&lang=fr`);
    const currentWeatherData = await currentWeatherResponse.json();

    // جلب بيانات التوقعات الساعية واليومية
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}&lang=fr`);
    const forecastData = await forecastResponse.json();

    currentCity = currentWeatherData.name;  // تحديث اسم المدينة الحالي

    // تكوين اسم المكان الكامل للعرض (المدينة، الولاية، الدولة)
    let fullPlaceName = '';
    if (place) {
      fullPlaceName += place.name || '';
      if (place.state && place.state !== place.name) fullPlaceName += `, ${place.state}`;
      fullPlaceName += `, ${place.country}`;
    } else {
      fullPlaceName = `${currentWeatherData.name}, ${currentWeatherData.sys.country}`;
    }

    // تحديث عناصر الواجهة بمعلومات الطقس الجديدة
    updateCurrentWeather(currentWeatherData, true, fullPlaceName);
    updateHourlyForecast(forecastData);
    updateDailyForecast(forecastData);

    // تحديث عرض تاريخ اليوم بشكل منسق باللغة الفرنسية
    const todayDateElement = document.getElementById('today-date');
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const todayFormatted = today.toLocaleDateString('fr-FR', options);
    if (todayDateElement) {
      // نجعل أول حرف كبير
      todayDateElement.textContent = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);
    }

  } catch (error) {
    alert('Erreur météo géolocalisation.'); // رسالة خطأ عند فشل الجلب
  } finally {
    showLoading(false);               // إخفاء مؤشر التحميل
  }
}

// === 11. عرض الخريطة باستخدام مكتبة Leaflet ===
function showMap(lat, lon) {
  const mapContainer = document.getElementById('map');  // العنصر الحاوي للخريطة
  if (!mapContainer) return;                             // إذا لم يوجد العنصر نخرج من الدالة

  // إذا كانت هناك خريطة سابقة، نحذفها لإعادة الإنشاء
  if (window.weatherMap) {
    window.weatherMap.remove();
  }

  // إنشاء خريطة جديدة مع ضبط مركز الخريطة على الإحداثيات المعطاة والتكبير المناسب
  const map = L.map('map').setView([lat, lon], 10);
  window.weatherMap = map;  // حفظ الخريطة في المتغير العالمي

  // إضافة طبقة الخريطة من OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // إضافة علامة (Marker) على موقع المستخدم مع نافذة منبثقة (Popup)
  L.marker([lat, lon]).addTo(map)
    .bindPopup('your position')
    .openPopup();
}

// === 12. جلب الطقس حسب اسم المدينة ===
async function getWeatherByCity(city) {
  try {
    showLoading(true);  // عرض مؤشر التحميل

    // جلب بيانات الطقس الحالية
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}&lang=fr`);
    const currentWeatherData = await currentWeatherResponse.json();

    if (currentWeatherData.cod === '404') throw new Error('Ville non trouvée'); // إذا لم توجد المدينة

    // جلب بيانات التوقعات الساعية
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${API_KEY}&lang=fr`);
    const forecastData = await forecastResponse.json();

    currentCity = currentWeatherData.name;  // تحديث اسم المدينة الحالي
    const displayName = `${currentWeatherData.name}, ${currentWeatherData.sys.country}`; // الاسم الكامل للعرض

    // تحديث بيانات الطقس على الواجهة
    updateCurrentWeather(currentWeatherData, false, displayName);
    updateHourlyForecast(forecastData);
    updateDailyForecast(forecastData);

    // تحديث الخريطة مع إحداثيات المدينة الجديدة
    const lat = currentWeatherData.coord.lat;
    const lon = currentWeatherData.coord.lon;
    showMap(lat, lon ,'fr');

  } catch {
    alert('Ville non trouvée. Vérifiez le nom.'); // تنبيه في حالة عدم وجود المدينة
  } finally {
    showLoading(false); // إخفاء مؤشر التحميل
  }
}

// === 13. تحديث معلومات الطقس الحالية في واجهة المستخدم ===
function updateCurrentWeather(data, isGeoLoad = false, displayName = '') {
  // تحديث اسم المدينة المعروض
  cityName.textContent = displayName || (isGeoLoad ? `${data.name}, ${data.sys.country}` : data.name);
  temperature.textContent = Math.round(data.main.temp);             // عرض درجة الحرارة بعد تقريبها
  weatherDescription.textContent = data.weather[0].description;    // عرض وصف الطقس (مثلاً "غائم")
  updateWeatherIcon(weatherIcon, data.weather[0].icon);             // تحديث أيقونة الطقس
  humidity.textContent = `${data.main.humidity}%`;                  // عرض نسبة الرطوبة
  // عرض سرعة الرياح مع تحويلها للوحدات المناسبة حسب الوحدة المختارة
  wind.textContent = currentUnit === 'metric' ? `${Math.round(data.wind.speed * 3.6)} km/h` : `${Math.round(data.wind.speed)} mph`;
  pressure.textContent = `${data.main.pressure} hPa`;               // عرض الضغط الجوي
  updateThemeByTime(data.dt, data.timezone);                        // تحديث الوضع الليلي أو النهاري حسب الوقت
}

// === 14. تحديث التوقعات الساعية (لـ 8 ساعات قادمة) ===
function updateHourlyForecast(data) {
  hourlyForecast.innerHTML = ''; // تفريغ المحتوى الحالي

  // نأخذ أول 8 عناصر من التوقعات الساعية
  data.list.slice(0, 8).forEach(item => {
    // تحويل timestamp إلى وقت بصيغة 24 ساعة بالفرنسية
    const hour = new Date(item.dt * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const temp = Math.round(item.main.temp); // تقريب درجة الحرارة

    // إنشاء عنصر جديد لكل ساعة
    const div = document.createElement('div');
    div.classList.add('hourly-item');

    // تنسيق المحتوى الداخلي للعنصر
    div.innerHTML = `
      <div class="hour">${hour}</div>
      <div class="icon"><i class="wi wi-owm-${item.weather[0].id}"></i></div>
      <div class="temp">${temp}°</div>
    `;

    hourlyForecast.appendChild(div); // إضافة العنصر إلى الحاوية
  });
}

// === 15. تحديث التوقعات اليومية (5 أيام القادمة) ===
function updateDailyForecast(data) {
  dailyForecast.innerHTML = ''; // تفريغ المحتوى الحالي
  const dailyData = {};         // كائن لتجميع بيانات كل يوم

  // تجميع البيانات لكل يوم بناءً على التواريخ
  data.list.forEach(item => {
    const dateObj = new Date(item.dt * 1000);
    const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayNumber = dateObj.getDate();
    const key = dateObj.toDateString(); // مفتاح فريد لليوم

    if (!dailyData[key]) { // إذا اليوم غير موجود مسبقًا
      dailyData[key] = {
        dayName: dayName,
        dayNumber: dayNumber,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        iconCode: item.weather[0].icon,
        description: item.weather[0].description
      };
    } else { // تحديث القيم الأدنى والأعلى
      dailyData[key].temp_min = Math.min(dailyData[key].temp_min, item.main.temp_min);
      dailyData[key].temp_max = Math.max(dailyData[key].temp_max, item.main.temp_max);
    }
  });

  // عرض أول 5 أيام فقط
  Object.values(dailyData).slice(0, 5).forEach(data => {
    const div = document.createElement('div');
    div.className = 'daily-item';

    // بناء الهيكل الداخلي لكل يوم
    div.innerHTML = `
      <div class="day-top">
        <span class="day">${data.dayName.charAt(0).toUpperCase() + data.dayName.slice(1)} ${data.dayNumber}</span>
        <i class="weather-icon"></i>
      </div>
      <div class="temps-range">
        <span class="temp-max">${Math.round(data.temp_max)}°</span>
        <span class="temp-min">${Math.round(data.temp_min)}°</span>
      </div>
      <div class="description">${data.description}</div>
    `;

    const iconElement = div.querySelector('.weather-icon');
    updateWeatherIcon(iconElement, data.iconCode); // تحديث الأيقونة حسب الحالة

    dailyForecast.appendChild(div); // إضافة العنصر إلى الحاوية
  });
}

// === 16. تحديث أيقونة الطقس بناءً على كود الأيقونة ===
function updateWeatherIcon(element, iconCode) {
  // خريطة الأيقونات بناءً على رموز API
  const icons = {
    '01d': 'wi-day-sunny', '02d': 'wi-day-cloudy', '03d': 'wi-cloud', '04d': 'wi-cloudy',
    '09d': 'wi-rain', '10d': 'wi-day-rain', '11d': 'wi-thunderstorm', '13d': 'wi-snow',
    '50d': 'wi-fog', '01n': 'wi-night-clear', '02n': 'wi-night-cloudy', '03n': 'wi-cloud',
    '04n': 'wi-cloudy', '09n': 'wi-rain', '10n': 'wi-night-rain', '11n': 'wi-thunderstorm',
    '13n': 'wi-snow', '50n': 'wi-fog'
  };
  element.className = 'wi ' + (icons[iconCode] || 'wi-day-sunny'); // تعيين كلاس الأيقونة
}

// === 17. تحديث المظهر تلقائيًا حسب توقيت اليوم (نهار أو ليل) ===
function updateThemeByTime(timestamp, timezone) {
  const date = new Date((timestamp + timezone) * 1000);  // حساب الوقت المحلي
  const hours = date.getUTCHours();                       // الحصول على الساعة
  if (hours >= 18 || hours < 6) {                         // إذا كانت الساعة بين 6 مساءً و6 صباحًا
    document.documentElement.setAttribute('data-theme', 'dark'); // تعيين الثيم إلى داكن
    themeToggle.innerHTML = '<i class="wi wi-moon-waxing-crescent-3"></i>'; // تغيير أيقونة الزر
  } else {
    document.documentElement.removeAttribute('data-theme');          // إزالة الثيم الداكن (نهاري)
    themeToggle.innerHTML = '<i class="wi wi-day-sunny"></i>';       // أيقونة الشمس للنهار
  }
}

// === 18. تبديل المظهر يدويًا من المستخدم (زر تبديل الثيم) ===
function toggleTheme() {
  const html = document.documentElement;
  if (html.getAttribute('data-theme') === 'dark') {     // إذا كان الوضع داكن
    html.removeAttribute('data-theme');                  // إلغاء الوضع الداكن
    themeToggle.innerHTML = '<i class="wi wi-day-sunny"></i>'; // عرض أيقونة النهار
  } else {
    html.setAttribute('data-theme', 'dark');             // تعيين الوضع الداكن
    themeToggle.innerHTML = '<i class="wi wi-moon-waxing-crescent-3"></i>'; // عرض أيقونة القمر
  }
}

// === 19. إظهار أو إخفاء مؤشر التحميل أثناء جلب البيانات ===
function showLoading(show) {
  const container = document.querySelector('.container'); // حاوية المحتوى الرئيسي
  if (show) {
    const loadingDiv = document.createElement('div');    // إنشاء عنصر جديد لعلامة التحميل
    loadingDiv.className = 'loading';                      // تعيين كلاس التحميل (لتنسيق CSS)
    loadingDiv.id = 'loading';                             // تعيين معرف فريد
    container.style.position = 'relative';                // تعديل CSS لجعل التحميل ظاهرًا بشكل صحيح
    container.appendChild(loadingDiv);                     // إضافة عنصر التحميل إلى الحاوية
  } else {
    const loadingElement = document.getElementById('loading'); // البحث عن عنصر التحميل الحالي
    if (loadingElement) loadingElement.remove();                // إزالته إذا كان موجودًا
  }
}
