// SPDX-License-Identifier: Apache-2.0
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import core from "@site/generated/core.json";
import styles from "./index.module.css";

const repo = "https://github.com/tynnpdhsp/SaigonOS";
const vietnameseDate = (date) => date.split("-").reverse().join("/");

export default function Home() {
  const [latest] = core.releases;
  return (
    <Layout title="Phần lõi nguồn mở của một hệ điều hành chuyển đổi số" description={core.intro}>
      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div>
              <h1 className={styles.title}>SaigonOS</h1>
              <p className={styles.lead}>{core.intro}</p>
              <div className={styles.actions}>
                <Link className="button button--primary button--lg" to="/docs/install">
                  Cài đặt
                </Link>
                <Link className="button button--secondary button--lg" href={repo}>
                  Mã nguồn trên GitHub
                </Link>
              </div>
              <p className={styles.meta}>
                Phiên bản mới nhất là <Link to={`/news/${latest.slug}`}>{core.version}</Link>, phát hành ngày{" "}
                {vietnameseDate(core.date)}. Giấy phép Apache-2.0.
              </p>
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

        <section className={`${styles.section} ${styles.grey}`}>
          <div className="container">
            <h2>Kiến trúc</h2>
            <img className={styles.diagram} src={useBaseUrl("/assets/architecture.svg")} alt="Sơ đồ kiến trúc của SaigonOS" />
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <h2>Thành phần</h2>
            <p>Lõi được xây dựng từ các phần mềm nguồn mở sau.</p>
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
        </section>

        <section className={styles.section}>
          <div className="container">
            <h2>Tin tức</h2>
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
