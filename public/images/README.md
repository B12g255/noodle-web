# 商品照片

把商品照片放到本目录（`public/images/`），然后在 `public/js/products.js` 里给对应商品的 `image` 字段填上路径（相对 `public/`）。

目前火腿肠两张已经接好：

| 商品 | 文件名 | image 字段 |
| --- | --- | --- |
| 普通火腿肠 | huotuichang.png | images/huotuichang.png |
| 玉米肠 | yumichang.png | images/yumichang.png |

其余商品（泡面、卤蛋、槟榔）的 `image` 目前留空，显示 emoji 占位图；把照片放进本目录、填好路径即可显示。

> 照片没放或名字不对时，页面会自动回退成 emoji 占位图，不会白屏。
