// SPDX-License-Identifier: Apache-2.0
import { readFileSync } from "node:fs";
import { themes } from "prism-react-renderer";

const core = JSON.parse(readFileSync("generated/core.json", "utf8"));
const repo = "https://github.com/tynnpdhsp/SaigonOS";
const baseUrl = "/SaigonOS-Website/";
const copyright = "Bản quyền © 2026 SaigonOS contributors. Mã nguồn được phát hành theo giấy phép Apache-2.0.";
const rank = new Map(core.releases.map((release, index) => [release.slug, index]));

export default {
  title: "SaigonOS",
  tagline: "Phần lõi nguồn mở của một hệ điều hành chuyển đổi số",
  favicon: "assets/logo/favicon.ico",
  url: "https://tynnpdhsp.github.io",
  baseUrl,
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: { hooks: { onBrokenMarkdownLinks: "throw", onBrokenMarkdownImages: "throw" } },
  i18n: { defaultLocale: "vi", locales: ["vi"] },
  staticDirectories: ["generated/static"],
  headTags: [
    { tagName: "link", attributes: { rel: "apple-touch-icon", href: `${baseUrl}assets/logo/apple-touch-icon.png` } },
  ],
  presets: [
    [
      "classic",
      {
        docs: {
          path: "generated/docs",
          sidebarPath: "./generated/sidebars.json",
          breadcrumbs: false,
          editUrl: ({ docPath }) => `${repo}/edit/main/docs/${docPath}`,
        },
        blog: {
          path: "generated/news",
          routeBasePath: "news",
          blogTitle: "Tin tức",
          blogDescription: "Tin tức về các bản phát hành của SaigonOS.",
          blogSidebarTitle: "Các bản phát hành",
          blogSidebarCount: "ALL",
          showReadingTime: false,
          feedOptions: { type: "all", title: "Tin tức SaigonOS", copyright },
          processBlogPosts: async ({ blogPosts }) =>
            blogPosts.toSorted(
              (a, b) => b.metadata.date - a.metadata.date || rank.get(a.metadata.frontMatter.slug) - rank.get(b.metadata.frontMatter.slug),
            ),
        },
        theme: { customCss: "./src/css/custom.css" },
      },
    ],
  ],
  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["vi", "en"],
        docsDir: "generated/docs",
        blogDir: "generated/news",
        blogRouteBasePath: "news",
        indexPages: false,
        explicitSearchResultPath: true,
      },
    ],
  ],
  themeConfig: {
    image: "assets/logo/social-preview.png",
    colorMode: { defaultMode: "light", disableSwitch: true, respectPrefersColorScheme: false },
    navbar: {
      logo: { alt: "SaigonOS", src: "assets/logo/saigonos-logo-text.svg" },
      items: [
        { type: "docSidebar", sidebarId: "docs", label: "Tài liệu", position: "left" },
        { to: "/news", label: "Tin tức", position: "left" },
        { to: `/news/${core.releases[0].slug}`, label: `Phiên bản ${core.version}`, position: "right" },
        { href: repo, label: "GitHub", position: "right" },
      ],
    },
    footer: {
      style: "light",
      logo: { alt: "SaigonOS", src: "assets/logo/saigonos-logo-text.svg", height: 40 },
      links: [
        {
          title: "Tài liệu",
          items: [
            { label: "Cài đặt", to: "/docs/install" },
            { label: "Viết ứng dụng đầu tiên", to: "/docs/first-app" },
            { label: "Lệnh saigonos", to: "/docs/reference/cli" },
          ],
        },
        {
          title: "Mã nguồn",
          items: [
            { label: "GitHub", href: repo },
            { label: "Releases", href: `${repo}/releases` },
            { label: "Nhật ký thay đổi", href: `${repo}/blob/main/CHANGELOG.md` },
          ],
        },
        {
          title: "Tham gia",
          items: [
            { label: "Báo lỗi", href: `${repo}/issues/new/choose` },
            { label: "Đóng góp mã nguồn", href: `${repo}/blob/main/CONTRIBUTING.md` },
            { label: "Báo cáo lỗ hổng bảo mật", href: `${repo}/blob/main/SECURITY.md` },
          ],
        },
      ],
      copyright,
    },
    prism: { theme: themes.github, additionalLanguages: ["bash", "nginx", "rego"] },
  },
};
