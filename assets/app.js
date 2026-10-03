(function () {
  var UI = {
    zh: {
      brand: '電商神助手',
      eyebrow: '學員專屬大禮包',
      title: '電商神助手 - 學員專屬大禮包',
      lead: '講師大軍精選的電商實用 AI 工具總表。從文案、商品圖、短影音到自動化客服，每個工具都附上「電商怎麼用」，幫你省時間、多賺錢。',
      instructor: '講師：大軍',
      count: function (n) { return '共 ' + n + ' 個工具'; },
      updated: '最後更新：',
      search: '搜尋工具、用途…',
      all: '全部',
      use: '電商怎麼用：',
      visit: '前往官網 →',
      empty: '找不到符合的工具，換個關鍵字試試。',
      footer1: '© 電商神助手．講師 大軍．本大禮包僅供學員學習使用。',
      footer2: '價格與功能以各工具官網為準，本表會持續更新。',
      langBtn: 'EN',
      htmlLang: 'zh-Hant',
      docTitle: '電商神助手 - 學員專屬大禮包'
    },
    en: {
      brand: 'E-commerce Genie',
      eyebrow: 'Student-exclusive gift pack',
      title: 'E-commerce Genie (電商神助手) — Student Gift Pack',
      lead: 'A curated list of practical AI tools for online sellers, hand-picked by instructor 大軍 (Da Jun). From copywriting and product photos to short videos and automated support, every tool comes with a "how sellers use it" tip.',
      instructor: 'Instructor: 大軍 (Da Jun)',
      count: function (n) { return n + ' tools'; },
      updated: 'Last updated: ',
      search: 'Search tools or use cases…',
      all: 'All',
      use: 'For sellers: ',
      visit: 'Visit site →',
      empty: 'No matching tools. Try another keyword.',
      footer1: '© E-commerce Genie (電商神助手) · Instructor 大軍 · For enrolled students.',
      footer2: 'Prices and features follow each tool\'s official site. This list is updated regularly.',
      langBtn: '中文',
      htmlLang: 'en',
      docTitle: 'E-commerce Genie — Student Gift Pack'
    }
  };

  var state = { lang: 'zh', cat: 'all', q: '' };
  var data = null;

  try {
    var saved = localStorage.getItem('lang');
    if (saved === 'zh' || saved === 'en') state.lang = saved;
  } catch (e) {}

  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function applyUI() {
    var t = UI[state.lang];
    document.documentElement.lang = t.htmlLang;
    document.title = t.docTitle;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t[el.getAttribute('data-i18n')];
      if (typeof v === 'string') el.textContent = v;
    });
    $('langBtn').textContent = t.langBtn;
    $('search').placeholder = t.search;
    if (data) {
      $('toolCount').textContent = t.count(data.tools.length);
      var latest = data.tools.map(function (x) { return x.updated; }).sort().pop();
      $('lastUpdated').textContent = t.updated + latest;
    }
  }

  function renderChips() {
    var t = UI[state.lang];
    var cats = [{ id: 'all', zh: t.all, en: t.all, icon: '✨' }].concat(data.categories);
    $('chips').innerHTML = cats.map(function (c) {
      var n = c.id === 'all' ? data.tools.length
        : data.tools.filter(function (x) { return x.category === c.id; }).length;
      return '<button type="button" class="chip" role="tab" data-cat="' + c.id + '" aria-selected="' +
        (state.cat === c.id) + '">' + c.icon + ' ' + esc(c[state.lang]) + ' <span class="muted">' + n + '</span></button>';
    }).join('');
  }

  function renderGrid() {
    var t = UI[state.lang];
    var catMap = {};
    data.categories.forEach(function (c) { catMap[c.id] = c; });
    var q = state.q.trim().toLowerCase();
    var list = data.tools.filter(function (x) {
      if (state.cat !== 'all' && x.category !== state.cat) return false;
      if (!q) return true;
      var c = catMap[x.category] || {};
      var hay = [x.name, x.zh.summary, x.zh.use, x.en.summary, x.en.use, c.zh, c.en].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    $('empty').hidden = list.length > 0;
    $('grid').innerHTML = list.map(function (x) {
      var c = catMap[x.category] || { icon: '', zh: '', en: '' };
      var p = data.pricing[x.pricing] || { zh: x.pricing, en: x.pricing };
      var L = x[state.lang];
      return '<article class="card">' +
        '<div class="card-head"><div><h2>' + esc(x.name) + '</h2>' +
        '<div class="cat">' + c.icon + ' ' + esc(c[state.lang]) + '</div></div>' +
        '<span class="price">' + esc(p[state.lang]) + '</span></div>' +
        '<p class="summary">' + esc(L.summary) + '</p>' +
        '<p class="use"><strong>' + t.use + '</strong>' + esc(L.use) + '</p>' +
        '<div class="card-foot"><span>' + esc(x.updated) + '</span>' +
        '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + t.visit + '</a></div>' +
        '</article>';
    }).join('');
  }

  function renderAll() { applyUI(); renderChips(); renderGrid(); }

  $('langBtn').addEventListener('click', function () {
    state.lang = state.lang === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('lang', state.lang); } catch (e) {}
    renderAll();
  });
  $('search').addEventListener('input', function (e) { state.q = e.target.value; renderGrid(); });
  $('chips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    state.cat = b.getAttribute('data-cat');
    renderChips(); renderGrid();
  });

  applyUI();
  fetch('data/tools.json', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (json) { data = json; renderAll(); })
    .catch(function () {
      $('empty').hidden = false;
      $('empty').textContent = state.lang === 'zh' ? '資料載入失敗，請重新整理。' : 'Failed to load data. Please refresh.';
    });
})();
