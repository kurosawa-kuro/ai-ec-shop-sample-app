# Scan Manifest

schema_version: 1
tool_version: 0.1.0
scan_id: 20260705T050205Z_14eead9e900b
generated_at: 2026-07-05T05:02:05Z
tool: decision-catalog (dcm)
language: infra+web
root: /home/ubuntu/repos/portfolio/lumiere-select
git_commit: 02fa8bbe35806554863d059cd0c4d81dd8703efd
git_branch: main
git_dirty: false
freshness_status: fresh

query_config_hash: e9dac3c3870d09c48c44a7f09c409e5a055fb41f762463fbe198c0ee6c5769aa
ignore_rules_hash: e8f0b03b63182f211b568f1e240f120892ed77d888a5fbac0075c20478e975a4
source_tree_hash: d0d5a4b71831bff3d0bc7e21cc1e2a89f2d7521f3bd2d506ab60f48bca3dfdaa
output_schema_version: 1

profile_resolution:
mode: auto
resolver: deterministic
llm_router_used: false
llm_router_is_evidence: false
candidates: infra,web
profiles_run: infra+web

requested_profiles: auto
detected_profiles: css,html,infra,node,typescript
coverage_warnings: unsupported extensions detected: example,jpg,local,png,sh,svg,toml

included_file_count: 194
symbol_count: 577
test_count: 3
entrypoint_count: 3

extractor:
  rust: syn AST exact v1 (line fallback only on parse failure)
  python: indent-heuristic v2 (public-by-convention/import/dependency inventory)
  typescript: line-heuristic v2 (export/import/dependency inventory)
  metrics: deterministic loc/symbol counts v1
  grep: substring v1

notes:
  - symbol 抽出は heuristic。macro / 動的生成は取りこぼす（99_scan_limitations.md 参照）。
  - grep no-hit は不存在の証明ではない。
