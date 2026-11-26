// SPDX-License-Identifier: Apache-2.0
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const repo = "https://github.com/tynnpdhsp/SaigonOS";
const out = "generated";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

function latestTag() {
  const key = (tag) => tag.slice(1).split(".").map(Number);
  const tags = git("ls-remote", "--tags", "--refs", `${repo}.git`)
    .split("\n")
    .map((line) => line.split("refs/tags/")[1])
    .filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag ?? ""))
    .sort((a, b) => {
      const [x, y] = [key(a), key(b)];
      return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
    });
  if (!tags.length) throw new Error(`Không tìm thấy tag phát hành nào ở ${repo}`);
  return tags.at(-1);
}

function dropLicenseLine(text) {
  const [first, ...rest] = text.split("\n");
  return first.startsWith("<!--") && first.includes("SPDX-License-Identifier") ? rest.join("\n") : text;
}

function section(text, title) {
  const part = text.split(/^## /m).find((candidate) => candidate.startsWith(`${title}\n`));
  if (!part) throw new Error(`README.md của repo SaigonOS không có mục "${title}"`);
  return part;
}

function linkParts(line) {
  return line
    .split(/(\[[^\]]+\]\([^)]+\))/)
    .filter(Boolean)
    .map((part) => {
      const doc = part.match(/^\[([^\]]+)\]\(docs\/([^)#]+)\.md(#[^)]*)?\)$/);
      const web = part.match(/^\[([^\]]+)\]\((https?:[^)]+)\)$/);
      if (doc) return { text: doc[1], to: `/docs/${doc[2]}${doc[3] ?? ""}` };
      if (web) return { text: web[1], href: web[2] };
      return { text: part };
    });
}

function escapeMdx(text) {
  let fenced = false;
  return text
    .split("\n")
    .map((line) => {
      if (line.startsWith("```")) {
        fenced = !fenced;
        return line;
      }
      if (fenced) return line;
      return line
        .split(/(`[^`]*`)/)
        .map((part, index) => (index % 2 ? part : part.replace(/[<{}]/g, "\\$&")))
        .join("");
    })
    .join("\n");
}

function copyDocs(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const [source, target] = [join(from, entry.name), join(to, entry.name)];
    if (entry.isDirectory()) copyDocs(source, target);
    else if (entry.name.endsWith(".md")) writeFileSync(target, dropLicenseLine(readFileSync(source, "utf8")));
    else cpSync(source, target);
  }
}

function sidebar(index) {
  const items = [{ type: "doc", id: "README", label: "Tổng quan" }];
  for (const line of index.split("\n")) {
    const heading = line.match(/^## (.+)$/);
    const link = line.match(/^- \[(.+)\]\((.+)\.md\)$/);
    if (heading) items.push({ type: "category", label: heading[1], collapsed: false, items: [] });
    else if (link && items.at(-1).type === "category") items.at(-1).items.push({ type: "doc", id: link[2], label: link[1] });
  }
  return { docs: items };
}

function releases(changelog) {
  return changelog
    .split(/^## /m)
    .slice(1)
    .flatMap((part) => {
      const [head, ...body] = part.split("\n");
      const match = head.match(/^\[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/);
      if (!match) return [];
      const notes = body
        .filter((line) => !/^\[[^\]]+\]: /.test(line))
        .join("\n")
        .trim()
        .replace(/^### /gm, "## ");
      return [{ version: match[1], date: match[2], slug: `saigonos-${match[1].replaceAll(".", "-")}`, notes }];
    });
}

const vietnameseDate = (date) => date.split("-").reverse().join("/");

function writeNews(list) {
  mkdirSync(join(out, "news"));
  for (const release of list) {
    const page = [
      "---",
      `title: SaigonOS ${release.version}`,
      `slug: ${release.slug}`,
      `date: ${release.date}`,
      "---",
      "",
      `SaigonOS ${release.version} được phát hành ngày ${vietnameseDate(release.date)}. File release có ở [trang release trên GitHub](${repo}/releases/tag/v${release.version}).`,
      "",
      "{/* truncate */}",
      "",
      escapeMdx(release.notes),
      "",
    ];
    writeFileSync(join(out, "news", `${release.date}-${release.slug}.md`), page.join("\n"));
  }
}

let source = process.env.CORE_DIR;
let clone;
try {
  if (!source) {
    const tag = latestTag();
    clone = mkdtempSync(join(tmpdir(), "saigonos-"));
    git("-c", "advice.detachedHead=false", "clone", "--quiet", "--depth", "1", "--branch", tag, `${repo}.git`, clone);
    source = clone;
  }
  const read = (path) => dropLicenseLine(readFileSync(join(source, path), "utf8"));
  const readme = read("README.md");
  const list = releases(read("CHANGELOG.md"));
  if (!list.length) throw new Error("CHANGELOG.md của repo SaigonOS chưa có bản phát hành nào");
  const intro = readme.split("\n").find((line) => /^\p{L}/u.test(line));
  const install = section(readme, "Cài đặt").match(/```bash\n([\s\S]*?)```/)?.[1].trim();
  if (!intro || !install) throw new Error("README.md của repo SaigonOS thiếu đoạn giới thiệu hoặc lệnh cài đặt");
  const parts = section(readme, "Thành phần").split("\n").slice(1);
  const diagramNote = parts.find((line) => /^\p{L}/u.test(line));
  const components = parts
    .filter((line) => line.startsWith("|"))
    .slice(2)
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

  rmSync(out, { recursive: true, force: true });
  copyDocs(join(source, "docs"), join(out, "docs"));
  cpSync(join(source, "docs", "assets"), join(out, "static", "assets"), { recursive: true });
  writeNews(list);
  writeFileSync(join(out, "sidebars.json"), JSON.stringify(sidebar(read("docs/README.md")), null, 2));
  const [latest] = list;
  const core = {
    version: latest.version,
    date: latest.date,
    intro,
    install,
    diagramNote: diagramNote ? linkParts(diagramNote) : [],
    components,
    releases: list.map(({ version, date, slug }) => ({ version, date, slug })),
  };
  writeFileSync(join(out, "core.json"), JSON.stringify(core, null, 2));
  console.log(`Đã lấy tài liệu và tin tức của SaigonOS ${latest.version}.`);
} finally {
  if (clone) rmSync(clone, { recursive: true, force: true });
}
