<!-- SPDX-License-Identifier: Apache-2.0 -->
# SaigonOS-Website

Mã nguồn của trang web [SaigonOS](https://github.com/tynnpdhsp/SaigonOS), gồm trang chủ, tài liệu và tin tức về các bản phát hành. Trang được dựng bằng [Docusaurus](https://docusaurus.io/).

## Chạy trên máy

Cần Node.js 20 trở lên và Git.

```bash
npm ci
npm run build
npm run serve
```

Trang chạy tại http://localhost:3000/SaigonOS-Website/. Lệnh `npm start` chạy bản phát triển và tự tải lại trang khi sửa file. Ô tìm kiếm chỉ hoạt động ở bản được dựng bằng `npm run build`.

## Nội dung lấy từ kho lõi

Trước khi dựng trang, lệnh `npm run sync` clone kho lõi ở tag mới nhất rồi tạo thư mục `generated`. Thư mục này gồm:

- Các trang tài liệu lấy từ thư mục `docs`. Mục lục bên trái được dựng từ `docs/README.md`.
- Mỗi bản phát hành một bài tin tức, lấy từ `CHANGELOG.md`.
- Đoạn giới thiệu, bảng thành phần và lệnh cài đặt trên trang chủ, lấy từ `README.md`.
- Logo và sơ đồ kiến trúc, lấy từ `docs/assets`.

Do đó, tài liệu được sửa ở kho lõi theo [CONTRIBUTING.md](https://github.com/tynnpdhsp/SaigonOS/blob/main/CONTRIBUTING.md) của kho đó, không sửa ở repo này. Để xem trước tài liệu chưa phát hành, đặt biến `CORE_DIR` là đường dẫn tới một bản clone của kho lõi, ví dụ `CORE_DIR=../SaigonOS npm run build`.

## Đăng trang

Mỗi lần có commit mới trên `main`, CI dựng trang và đăng lên GitHub Pages. CI cũng dựng lại trang mỗi ngày một lần để lấy bản phát hành mới của kho lõi.

## Giấy phép

Mã nguồn được phát hành theo giấy phép [Apache-2.0](LICENSE).
