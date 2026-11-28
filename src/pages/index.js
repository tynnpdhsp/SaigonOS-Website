// SPDX-License-Identifier: Apache-2.0
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import core from "@site/generated/core.json";
import styles from "./index.module.css";

const repo = "https://github.com/tynnpdhsp/SaigonOS";
const tagline = "Một lõi chung cho các ứng dụng chuyển đổi số";
const pageTitle = `SaigonOS - ${tagline}`;
const vietnameseDate = (date) => date.split("-").reverse().join("/");

const features = [
  {
    title: "Đăng nhập một lần",
    text: "Người dùng đăng nhập bằng Keycloak một lần cho mọi ứng dụng. Tài khoản quản trị của realm saigonos dùng thêm mã OTP.",
    to: "/docs/apps/login",
    icon: (
      <>
        <circle cx="7.5" cy="15.5" r="4" />
        <path d="M10.5 12.5 20 3M16 7l3 3M13.5 9.5l2 2" />
      </>
    ),
  },
  {
    title: "API Gateway",
    text: "APISIX kiểm tra access token và hỏi Open Policy Agent trước khi cho lời gọi đi qua. Tường lửa Coraza chặn các lời gọi có dấu hiệu tấn công.",
    to: "/docs/admin/access-rules",
    icon: (
      <>
        <path d="M12 3l8 3v5.5c0 4.6-3.3 8.4-8 9.5-4.7-1.1-8-4.9-8-9.5V6z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </>
    ),
  },
  {
    title: "Dữ liệu và REST API",
    text: "PostgREST tạo REST API từ schema của từng ứng dụng trong PostgreSQL. Row-Level Security kiểm tra quyền trên từng dòng. Audit log ghi lại thay đổi của các bảng được chọn.",
    to: "/docs/apps/database",
    icon: (
      <>
        <ellipse cx="12" cy="5.5" rx="7.5" ry="2.5" />
        <path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13" />
        <path d="M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" />
      </>
    ),
  },
  {
    title: "Tìm kiếm toàn văn",
    text: "Ứng dụng liệt kê trong bản khai báo các bảng và cột cần tìm. Chữ cần tìm gõ có dấu hay không dấu đều được.",
    to: "/docs/apps/search",
    icon: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5 21 21" />
      </>
    ),
  },
  {
    title: "Lưu trữ và hồ dữ liệu",
    text: "Dòng cũ của các bảng đã khai được chuyển xuống hồ dữ liệu, gồm các file Parquet trên SeaweedFS. Số liệu được chốt theo tháng. Người quản trị truy vấn hồ bằng SQL của DuckDB.",
    to: "/docs/admin/data-lake",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="5" rx="1" />
        <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4" />
      </>
    ),
  },
  {
    title: "File và quét mã độc",
    text: "File tải lên được ClamAV quét rồi mới lưu vào SeaweedFS. File có mã độc bị giữ lại và không tải về được.",
    to: "/docs/apps/files",
    icon: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 14l2 2 4-4" />
      </>
    ),
  },
  {
    title: "Quy trình",
    text: "Quy trình được viết bằng BPMN 2.0 và chạy trên Operaton. Lệnh cài đặt ứng dụng tự triển khai các file BPMN.",
    to: "/docs/apps/workflow",
    icon: (
      <>
        <rect x="3" y="3.5" width="7" height="5" rx="1" />
        <rect x="14" y="3.5" width="7" height="5" rx="1" />
        <rect x="8.5" y="15.5" width="7" height="5" rx="1" />
        <path d="M10 6h4M6.5 8.5V12h11V8.5M12 12v3.5" />
      </>
    ),
  },
  {
    title: "Cập nhật tức thời và thông báo",
    text: "Centrifugo đẩy cập nhật tới trình duyệt qua WebSocket. Thông báo được gửi tới người dùng, nhóm Telegram và email.",
    to: "/docs/apps/realtime",
    icon: (
      <>
        <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" />
        <path d="M10 20.5a2 2 0 0 0 4 0" />
      </>
    ),
  },
  {
    title: "Giám sát",
    text: "Prometheus thu metrics và Loki lưu log của các container. Grafana hiển thị cả hai. Giám sát mặc định tắt.",
    to: "/docs/admin/monitoring",
    icon: <path d="M3 12h4l3-7 4 14 3-7h4" />,
  },
];

export default function Home() {
  const [latest] = core.releases;
  return (
    <Layout description={core.intro}>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "WebSite", name: "SaigonOS", url: "https://www.saigonos.org/", inLanguage: "vi" },
              {
                "@type": "SoftwareSourceCode",
                name: "SaigonOS",
                description: core.intro,
                url: "https://www.saigonos.org/",
                codeRepository: repo,
                license: "https://www.apache.org/licenses/LICENSE-2.0",
                programmingLanguage: "Python",
                version: core.version,
              },
            ],
          })}
        </script>
      </Head>
      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div>
              <Link className={styles.badge} to={`/news/${latest.slug}`}>
                Phiên bản {core.version}, phát hành ngày {vietnameseDate(core.date)}
              </Link>
              <h1 className={styles.title}>{tagline.replace(/ (dụng|đổi|số)/g, " $1")}</h1>
              <p className={styles.lead}>{core.intro.replaceAll("-", "‑")}</p>
              <div className={styles.actions}>
                <Link className="button button--primary button--lg" to="/docs/install">
                  Bắt đầu cài đặt
                </Link>
                <Link className="button button--outline button--primary button--lg" href={repo}>
                  Mã nguồn trên GitHub
                </Link>
              </div>
            </div>
            <div>
              <CodeBlock language="bash" title="Cài đặt trên Linux">
                {core.install}
              </CodeBlock>
              <p className={styles.note}>
                Yêu cầu về máy và các bước chi tiết có ở trang <Link to="/docs/install">Cài đặt</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.heading}>Chức năng của lõi</h2>
            <div className={styles.features}>
              {features.map((feature) => (
                <div key={feature.title} className={styles.feature}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </svg>
                  <h3>
                    <Link to={feature.to}>{feature.title}</Link>
                  </h3>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.grey}`}>
          <div className="container">
            <h2 className={styles.heading}>Kiến trúc</h2>
            <p className={styles.subtitle}>Các service chạy liên tục của lõi và chiều gửi yêu cầu giữa chúng.</p>
            <div className={styles.panel}>
              <img className={styles.diagram} src={useBaseUrl("/assets/architecture.svg")} alt="Sơ đồ kiến trúc của SaigonOS" />
            </div>
            {core.diagramNote.length > 0 && (
              <p className={styles.caption}>
                {core.diagramNote.map((part, index) =>
                  part.to || part.href ? (
                    <Link key={index} to={part.to} href={part.href}>
                      {part.text}
                    </Link>
                  ) : (
                    <span key={index}>{part.text}</span>
                  ),
                )}
              </p>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.heading}>Thành phần</h2>
            <p className={styles.subtitle}>Lõi được xây dựng từ các phần mềm nguồn mở sau.</p>
            <div className={styles.tableFrame}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Chức năng</th>
                    <th>Phần mềm</th>
                  </tr>
                </thead>
                <tbody>
                  {core.components.map(([feature, software]) => (
                    <tr key={feature}>
                      <td>{feature}</td>
                      <td>{software}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.grey}`}>
          <div className="container">
            <h2 className={styles.heading}>Tin tức</h2>
            <ul className={styles.news}>
              {core.releases.slice(0, 3).map((release) => (
                <li key={release.slug}>
                  <span className={styles.date}>{vietnameseDate(release.date)}</span>
                  <Link to={`/news/${release.slug}`}>SaigonOS {release.version} được phát hành</Link>
                </li>
              ))}
            </ul>
            <Link to="/news">Xem tất cả tin tức</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
