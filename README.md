# 電商神助手 - 學員專屬大禮包

講師 **大軍** 為學員整理的電商實用 AI 工具總表，中英雙語。
A bilingual (Traditional Chinese / English) directory of practical AI tools for online sellers, curated by instructor 大軍.

🌐 網站 / Site: https://gervenbuy.github.io/ecom-ai-gift-pack/

## 檔案結構

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 網站頁面 |
| `assets/style.css` | 樣式 |
| `assets/app.js` | 搜尋、分類篩選、語言切換 |
| `data/tools.json` | **工具資料（新增工具只要改這裡）** |

## 新增工具

在 `data/tools.json` 的 `tools` 陣列加一筆：

```json
{
  "name": "工具名稱",
  "category": "chat | writing | image | video | audio | docs | automation",
  "url": "https://官網",
  "pricing": "free | freemium | paid | opensource",
  "updated": "YYYY-MM-DD",
  "zh": { "summary": "一句話介紹", "use": "電商怎麼用" },
  "en": { "summary": "One-line summary", "use": "How sellers use it" }
}
```

推上 `main` 後 GitHub Pages 會自動更新網站。
