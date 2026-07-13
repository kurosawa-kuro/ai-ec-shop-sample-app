# LLM Context Pack

## Mandatory Rules

- Do not create, overwrite, or backfill Evidence. `evidence/` is read-only Non-LLM input.
- Create `catalog_items` by repo object, not by Evidence artifact. One item key must be a file/module/symbol/entrypoint/env/dependency/test surface in the target repo.
- Evidence artifacts are inputs only. Never make `00_scan_manifest.md`, `03_symbols.md`, `30_static_signal_hits.md`, `99_scan_limitations.md`, `grep`, `change_signal`, `/`, or `src/` into a catalog item.
- Cover every relevant Evidence Index row by attaching evidence_ids to repo-object items, `scan_summary`, or `evidence_appendix`; do not silently drop evidence.
- Facts must describe the target object, not the existence of Evidence Pack files.
- Put count-only grep totals, no-hit notes, parser limitations, scan manifest/metrics/file tree, generic public API listings, and generic change signals in `scan_summary` or `evidence_appendix`, not in `catalog_items`.
- Dependency inventory and test evidence are not mere appendix when present. Create repo-object catalog items for dependency surface (`Cargo.toml` or package manifest) and test surface (`test_count`, test modules, or test files) when the evidence exists.
- A catalog item must be self-contained: an upper model must not need to open `evidence/` or `src/` to understand the object state. Do not write `refer to the evidence file`, `当該ファイルを参照`, or equivalent.
- `scan_summary` and `evidence_appendix` must also be self-contained summaries. Do not write `詳細は証拠`, `証拠を参照`, `文脈確認が必要`, or other next-action wording anywhere in the output.
- Meaning must pass the repo-specific test: could this role/implication have been written without seeing this repo? If yes, move it to appendix or rewrite it around concrete target paths/symbols.
- Add `flow_items` as first-class observed flow candidates when command/entrypoint/symbol evidence exposes connected movement. Use the name `Observed Primary Flow Candidate` conceptually, but the machine label should be descriptive such as `primary_task_lifecycle_candidate`, `destructive_management_candidate`, or `clear_all_surface_candidate`.
- Flow items are descriptive mirror material, not recommendations. Do not call a flow Golden Path or Critical User Journey as fact.
- Keep primary lifecycle and destructive management flows separate. The primary candidate must not include remove/delete/clear steps or basis entries. Clear-all is distinct from remove and must not be merged into the remove flow. If clear evidence exists, create a separate `clear_all_surface_candidate` with `flow_type: destructive_surface_candidate`; when CLI exposure is uncertain, use `surface: candidate clear operation` and put the exposure gap in `cannot_conclude`.
- Do not write real subcommand names such as `task add` unless Command variants or CLI parse evidence confirms that exact surface. If not confirmed, use candidate language such as `candidate add operation` / `candidate list operation` / `candidate status update operation`.
- Each flow must include `basis` and each step must include `user_intent`, `surface`, `components`, `data_effect`, `confidence`, and `evidence_ids` in JSON. Markdown body will render semantic fields only; evidence_ids remain machine-only. If call graph evidence is not available, set `grounding_level: weak` and put the limitation in `cannot_conclude`.
- A grep no-hit is not proof that something does not exist.
- Do not infer, reconstruct, or preserve secret values.
- Keep fact fields Non-LLM and observational; put role and current implications in meaning.
- Do not include advice, recommendations, next actions, validation plans, rollback plans, or change boundaries.

## Domain Selection Rules

- `domain` は scan profile ではなく、target の実コード・entrypoint・domain evidence から見える主対象を書く。
- `profiles_run` / `detected_profiles` に `infra` が含まれていても、それだけで `domain: infra` にしない。YAML/JSON/config は補助 evidence として扱う。
- `domain: infra` は `domain/00_infra_resources.md` に具体的な Terraform / GitHub Actions / Dockerfile resource, job, image, or secret/env reference が観測される場合だけ使う。
- `domain/00_infra_resources.md` が `status: no infra domain evidence detected` の場合、小さな CLI / library / web app の domain を infra にしない。

## Machine Provenance Boundary（重要）

JSON では、下の Evidence IDs 表にある `evidence_id` を `evidence_ids` に入れて接地を示す。存在しない id は禁止。
ただし `evidence_ids` は machine join key であり、最上位モデルの新しいアイディア・設計判断には寄与しない。
最終 Markdown 本体には program が `evidence_ids` / file / line / scan_id / sha256 を一切出さない。完全な machine provenance は `evidence_index.jsonl` sidecar に隔離する。

## Evidence IDs（catalog_items で使える evidence_id）

| evidence_id | file | lines |
|---|---|---|
| ev.00_scan_manifest_md | evidence/00_scan_manifest.md | 1-46 |
| ev.00_evidence_freshness_md | evidence/00_evidence_freshness.md | 1-12 |
| ev.01_file_tree_md | evidence/01_file_tree.md | 1-196 |
| ev.02_files_json | evidence/02_files.json | 1-196 |
| ev.03_symbols_md | evidence/03_symbols.md | 1-666 |
| ev.03_symbols_md.app_index_html | evidence/03_symbols.md | 3-6 |
| ev.03_symbols_md.app_src_app_css | evidence/03_symbols.md | 7-28 |
| ev.03_symbols_md.app_src_app_jsx | evidence/03_symbols.md | 29-32 |
| ev.03_symbols_md.app_src_components_checkoutsteps_jsx | evidence/03_symbols.md | 33-37 |
| ev.03_symbols_md.app_src_components_flyingcartitem_jsx | evidence/03_symbols.md | 38-44 |
| ev.03_symbols_md.app_src_components_footer_jsx | evidence/03_symbols.md | 45-49 |
| ev.03_symbols_md.app_src_components_header_jsx | evidence/03_symbols.md | 50-54 |
| ev.03_symbols_md.app_src_components_transitionlink_jsx | evidence/03_symbols.md | 55-58 |
| ev.03_symbols_md.app_src_data_engineer_profile_js | evidence/03_symbols.md | 59-62 |
| ev.03_symbols_md.app_src_index_css | evidence/03_symbols.md | 63-516 |
| ev.03_symbols_md.app_src_lib_ailimit_js | evidence/03_symbols.md | 517-524 |
| ev.03_symbols_md.app_src_lib_cart_js | evidence/03_symbols.md | 525-548 |
| ev.03_symbols_md.app_src_lib_giftlabels_js | evidence/03_symbols.md | 549-555 |
| ev.03_symbols_md.app_src_lib_motion_js | evidence/03_symbols.md | 556-559 |
| ev.03_symbols_md.app_src_lib_supabase_js | evidence/03_symbols.md | 560-565 |
| ev.03_symbols_md.app_src_lib_viewtransition_js | evidence/03_symbols.md | 566-569 |
| ev.03_symbols_md.app_src_pages_about_jsx | evidence/03_symbols.md | 570-573 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx | evidence/03_symbols.md | 574-585 |
| ev.03_symbols_md.app_src_pages_cart_jsx | evidence/03_symbols.md | 586-590 |
| ev.03_symbols_md.app_src_pages_checkout_jsx | evidence/03_symbols.md | 591-596 |
| ev.03_symbols_md.app_src_pages_complete_jsx | evidence/03_symbols.md | 597-601 |
| ev.03_symbols_md.app_src_pages_concierge_jsx | evidence/03_symbols.md | 602-614 |
| ev.03_symbols_md.app_src_pages_orders_jsx | evidence/03_symbols.md | 615-618 |
| ev.03_symbols_md.app_src_pages_productdetail_jsx | evidence/03_symbols.md | 619-623 |
| ev.03_symbols_md.app_src_pages_products_jsx | evidence/03_symbols.md | 624-627 |
| ev.03_symbols_md.app_src_pages_top_jsx | evidence/03_symbols.md | 628-632 |
| ev.03_symbols_md.app_vite_config_js | evidence/03_symbols.md | 633-636 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts | evidence/03_symbols.md | 637-656 |
| ev.03_symbols_md.supabase_functions_recommend_products_index_ts | evidence/03_symbols.md | 657-666 |
| ev.03_symbols_md.app_index_html.root.l5 | evidence/03_symbols.md | 5-5 |
| ev.03_symbols_md.app_src_app_css.counter.l9 | evidence/03_symbols.md | 9-9 |
| ev.03_symbols_md.app_src_app_css.hero.l10 | evidence/03_symbols.md | 10-10 |
| ev.03_symbols_md.app_src_app_css.base.l11 | evidence/03_symbols.md | 11-11 |
| ev.03_symbols_md.app_src_app_css.framework.l12 | evidence/03_symbols.md | 12-12 |
| ev.03_symbols_md.app_src_app_css.vite.l13 | evidence/03_symbols.md | 13-13 |
| ev.03_symbols_md.app_src_app_css.base.l14 | evidence/03_symbols.md | 14-14 |
| ev.03_symbols_md.app_src_app_css.framework.l15 | evidence/03_symbols.md | 15-15 |
| ev.03_symbols_md.app_src_app_css.vite.l16 | evidence/03_symbols.md | 16-16 |
| ev.03_symbols_md.app_src_app_css.framework.l17 | evidence/03_symbols.md | 17-17 |
| ev.03_symbols_md.app_src_app_css.vite.l18 | evidence/03_symbols.md | 18-18 |
| ev.03_symbols_md.app_src_app_css.center.l19 | evidence/03_symbols.md | 19-19 |
| ev.03_symbols_md.app_src_app_css.next_steps.l20 | evidence/03_symbols.md | 20-20 |
| ev.03_symbols_md.app_src_app_css.icon.l21 | evidence/03_symbols.md | 21-21 |
| ev.03_symbols_md.app_src_app_css.docs.l22 | evidence/03_symbols.md | 22-22 |
| ev.03_symbols_md.app_src_app_css.next_steps.l23 | evidence/03_symbols.md | 23-23 |
| ev.03_symbols_md.app_src_app_css.logo.l24 | evidence/03_symbols.md | 24-24 |
| ev.03_symbols_md.app_src_app_css.button_icon.l25 | evidence/03_symbols.md | 25-25 |
| ev.03_symbols_md.app_src_app_css.spacer.l26 | evidence/03_symbols.md | 26-26 |
| ev.03_symbols_md.app_src_app_css.ticks.l27 | evidence/03_symbols.md | 27-27 |
| ev.03_symbols_md.app_src_app_jsx.app.l31 | evidence/03_symbols.md | 31-31 |
| ev.03_symbols_md.app_src_components_checkoutsteps_jsx.steps.l35 | evidence/03_symbols.md | 35-35 |
| ev.03_symbols_md.app_src_components_checkoutsteps_jsx.checkoutsteps.l36 | evidence/03_symbols.md | 36-36 |
| ev.03_symbols_md.app_src_components_flyingcartitem_jsx.gradients.l40 | evidence/03_symbols.md | 40-40 |
| ev.03_symbols_md.app_src_components_flyingcartitem_jsx.flyingcartitem.l41 | evidence/03_symbols.md | 41-41 |
| ev.03_symbols_md.app_src_components_flyingcartitem_jsx.size.l42 | evidence/03_symbols.md | 42-42 |
| ev.03_symbols_md.app_src_components_flyingcartitem_jsx.bullet.l43 | evidence/03_symbols.md | 43-43 |
| ev.03_symbols_md.app_src_components_footer_jsx.links.l47 | evidence/03_symbols.md | 47-47 |
| ev.03_symbols_md.app_src_components_footer_jsx.footer.l48 | evidence/03_symbols.md | 48-48 |
| ev.03_symbols_md.app_src_components_header_jsx.getcount.l52 | evidence/03_symbols.md | 52-52 |
| ev.03_symbols_md.app_src_components_header_jsx.header.l53 | evidence/03_symbols.md | 53-53 |
| ev.03_symbols_md.app_src_components_transitionlink_jsx.transitionlink.l57 | evidence/03_symbols.md | 57-57 |
| ev.03_symbols_md.app_src_data_engineer_profile_js.buildsystemprompt.l61 | evidence/03_symbols.md | 61-61 |
| ev.03_symbols_md.app_src_index_css.bg.l65 | evidence/03_symbols.md | 65-65 |
| ev.03_symbols_md.app_src_index_css.surface.l66 | evidence/03_symbols.md | 66-66 |
| ev.03_symbols_md.app_src_index_css.surface_soft.l67 | evidence/03_symbols.md | 67-67 |
| ev.03_symbols_md.app_src_index_css.ink.l68 | evidence/03_symbols.md | 68-68 |
| ev.03_symbols_md.app_src_index_css.muted.l69 | evidence/03_symbols.md | 69-69 |
| ev.03_symbols_md.app_src_index_css.line.l70 | evidence/03_symbols.md | 70-70 |
| ev.03_symbols_md.app_src_index_css.brand.l71 | evidence/03_symbols.md | 71-71 |
| ev.03_symbols_md.app_src_index_css.brand_strong.l72 | evidence/03_symbols.md | 72-72 |
| ev.03_symbols_md.app_src_index_css.accent.l73 | evidence/03_symbols.md | 73-73 |
| ev.03_symbols_md.app_src_index_css.accent_soft.l74 | evidence/03_symbols.md | 74-74 |
| ev.03_symbols_md.app_src_index_css.shadow.l75 | evidence/03_symbols.md | 75-75 |
| ev.03_symbols_md.app_src_index_css.shadow_hover.l76 | evidence/03_symbols.md | 76-76 |
| ev.03_symbols_md.app_src_index_css.radius.l77 | evidence/03_symbols.md | 77-77 |
| ev.03_symbols_md.app_src_index_css.space_1.l78 | evidence/03_symbols.md | 78-78 |
| ev.03_symbols_md.app_src_index_css.space_2.l79 | evidence/03_symbols.md | 79-79 |
| ev.03_symbols_md.app_src_index_css.space_3.l80 | evidence/03_symbols.md | 80-80 |
| ev.03_symbols_md.app_src_index_css.space_4.l81 | evidence/03_symbols.md | 81-81 |
| ev.03_symbols_md.app_src_index_css.space_5.l82 | evidence/03_symbols.md | 82-82 |
| ev.03_symbols_md.app_src_index_css.space_6.l83 | evidence/03_symbols.md | 83-83 |
| ev.03_symbols_md.app_src_index_css.space_8.l84 | evidence/03_symbols.md | 84-84 |
| ev.03_symbols_md.app_src_index_css.leading_tight.l85 | evidence/03_symbols.md | 85-85 |
| ev.03_symbols_md.app_src_index_css.leading_normal.l86 | evidence/03_symbols.md | 86-86 |
| ev.03_symbols_md.app_src_index_css.leading_relaxed.l87 | evidence/03_symbols.md | 87-87 |
| ev.03_symbols_md.app_src_index_css.tap_min.l88 | evidence/03_symbols.md | 88-88 |
| ev.03_symbols_md.app_src_index_css.root.l89 | evidence/03_symbols.md | 89-89 |
| ev.03_symbols_md.app_src_index_css.site_header.l90 | evidence/03_symbols.md | 90-90 |
| ev.03_symbols_md.app_src_index_css.header_inner.l91 | evidence/03_symbols.md | 91-91 |
| ev.03_symbols_md.app_src_index_css.header_logo.l92 | evidence/03_symbols.md | 92-92 |
| ev.03_symbols_md.app_src_index_css.header_logo.l93 | evidence/03_symbols.md | 93-93 |
| ev.03_symbols_md.app_src_index_css.header_nav.l94 | evidence/03_symbols.md | 94-94 |
| ev.03_symbols_md.app_src_index_css.header_nav.l95 | evidence/03_symbols.md | 95-95 |
| ev.03_symbols_md.app_src_index_css.header_nav.l96 | evidence/03_symbols.md | 96-96 |
| ev.03_symbols_md.app_src_index_css.header_nav_cta.l97 | evidence/03_symbols.md | 97-97 |
| ev.03_symbols_md.app_src_index_css.cart_link.l98 | evidence/03_symbols.md | 98-98 |
| ev.03_symbols_md.app_src_index_css.cart_link.l99 | evidence/03_symbols.md | 99-99 |
| ev.03_symbols_md.app_src_index_css.cart_badge.l100 | evidence/03_symbols.md | 100-100 |
| ev.03_symbols_md.app_src_index_css.checkout_steps.l101 | evidence/03_symbols.md | 101-101 |
| ev.03_symbols_md.app_src_index_css.step.l102 | evidence/03_symbols.md | 102-102 |
| ev.03_symbols_md.app_src_index_css.step.l103 | evidence/03_symbols.md | 103-103 |
| ev.03_symbols_md.app_src_index_css.step_pending.l104 | evidence/03_symbols.md | 104-104 |
| ev.03_symbols_md.app_src_index_css.step_active.l105 | evidence/03_symbols.md | 105-105 |
| ev.03_symbols_md.app_src_index_css.step_done.l106 | evidence/03_symbols.md | 106-106 |
| ev.03_symbols_md.app_src_index_css.step_num.l107 | evidence/03_symbols.md | 107-107 |
| ev.03_symbols_md.app_src_index_css.step_done.l108 | evidence/03_symbols.md | 108-108 |
| ev.03_symbols_md.app_src_index_css.step_active.l109 | evidence/03_symbols.md | 109-109 |
| ev.03_symbols_md.app_src_index_css.site_page.l110 | evidence/03_symbols.md | 110-110 |
| ev.03_symbols_md.app_src_index_css.hero_section.l111 | evidence/03_symbols.md | 111-111 |
| ev.03_symbols_md.app_src_index_css.hero_section.l112 | evidence/03_symbols.md | 112-112 |
| ev.03_symbols_md.app_src_index_css.hero_copy.l113 | evidence/03_symbols.md | 113-113 |
| ev.03_symbols_md.app_src_index_css.hero_copy.l114 | evidence/03_symbols.md | 114-114 |
| ev.03_symbols_md.app_src_index_css.page_heading.l115 | evidence/03_symbols.md | 115-115 |
| ev.03_symbols_md.app_src_index_css.hero_copy.l116 | evidence/03_symbols.md | 116-116 |
| ev.03_symbols_md.app_src_index_css.eyebrow.l117 | evidence/03_symbols.md | 117-117 |
| ev.03_symbols_md.app_src_index_css.lead.l118 | evidence/03_symbols.md | 118-118 |
| ev.03_symbols_md.app_src_index_css.concierge_form.l119 | evidence/03_symbols.md | 119-119 |
| ev.03_symbols_md.app_src_index_css.guided_entry.l120 | evidence/03_symbols.md | 120-120 |
| ev.03_symbols_md.app_src_index_css.guided_group.l121 | evidence/03_symbols.md | 121-121 |
| ev.03_symbols_md.app_src_index_css.guided_group.l122 | evidence/03_symbols.md | 122-122 |
| ev.03_symbols_md.app_src_index_css.guided_submit.l123 | evidence/03_symbols.md | 123-123 |
| ev.03_symbols_md.app_src_index_css.concierge_form.l124 | evidence/03_symbols.md | 124-124 |
| ev.03_symbols_md.app_src_index_css.filters.l125 | evidence/03_symbols.md | 125-125 |
| ev.03_symbols_md.app_src_index_css.hero_search.l126 | evidence/03_symbols.md | 126-126 |
| ev.03_symbols_md.app_src_index_css.hero_search.l127 | evidence/03_symbols.md | 127-127 |
| ev.03_symbols_md.app_src_index_css.hero_search.l128 | evidence/03_symbols.md | 128-128 |
| ev.03_symbols_md.app_src_index_css.hero_search.l129 | evidence/03_symbols.md | 129-129 |
| ev.03_symbols_md.app_src_index_css.hero_search.l130 | evidence/03_symbols.md | 130-130 |
| ev.03_symbols_md.app_src_index_css.button.l131 | evidence/03_symbols.md | 131-131 |
| ev.03_symbols_md.app_src_index_css.hero_search.l132 | evidence/03_symbols.md | 132-132 |
| ev.03_symbols_md.app_src_index_css.button_primary.l133 | evidence/03_symbols.md | 133-133 |
| ev.03_symbols_md.app_src_index_css.ai_sort.l134 | evidence/03_symbols.md | 134-134 |
| ev.03_symbols_md.app_src_index_css.hero_search.l135 | evidence/03_symbols.md | 135-135 |
| ev.03_symbols_md.app_src_index_css.button_primary.l136 | evidence/03_symbols.md | 136-136 |
| ev.03_symbols_md.app_src_index_css.ai_sort.l137 | evidence/03_symbols.md | 137-137 |
| ev.03_symbols_md.app_src_index_css.button_secondary.l138 | evidence/03_symbols.md | 138-138 |
| ev.03_symbols_md.app_src_index_css.hero_search.l139 | evidence/03_symbols.md | 139-139 |
| ev.03_symbols_md.app_src_index_css.chip_row.l140 | evidence/03_symbols.md | 140-140 |
| ev.03_symbols_md.app_src_index_css.chip.l141 | evidence/03_symbols.md | 141-141 |
| ev.03_symbols_md.app_src_index_css.chip.l142 | evidence/03_symbols.md | 142-142 |
| ev.03_symbols_md.app_src_index_css.chip_active.l143 | evidence/03_symbols.md | 143-143 |
| ev.03_symbols_md.app_src_index_css.chip_active.l144 | evidence/03_symbols.md | 144-144 |
| ev.03_symbols_md.app_src_index_css.cta_row.l145 | evidence/03_symbols.md | 145-145 |
| ev.03_symbols_md.app_src_index_css.product_card_footer.l146 | evidence/03_symbols.md | 146-146 |
| ev.03_symbols_md.app_src_index_css.products_toolbar.l147 | evidence/03_symbols.md | 147-147 |
| ev.03_symbols_md.app_src_index_css.product_category.l148 | evidence/03_symbols.md | 148-148 |
| ev.03_symbols_md.app_src_index_css.product_image.l149 | evidence/03_symbols.md | 149-149 |
| ev.03_symbols_md.app_src_index_css.product_image_data_category.l150 | evidence/03_symbols.md | 150-150 |
| ev.03_symbols_md.app_src_index_css.product_image_data_category.l151 | evidence/03_symbols.md | 151-151 |
| ev.03_symbols_md.app_src_index_css.product_image_data_category.l152 | evidence/03_symbols.md | 152-152 |
| ev.03_symbols_md.app_src_index_css.product_image_data_category.l153 | evidence/03_symbols.md | 153-153 |
| ev.03_symbols_md.app_src_index_css.product_image_data_category.l154 | evidence/03_symbols.md | 154-154 |
| ev.03_symbols_md.app_src_index_css.product_image_data_category.l155 | evidence/03_symbols.md | 155-155 |
| ev.03_symbols_md.app_src_index_css.product_image.l156 | evidence/03_symbols.md | 156-156 |
| ev.03_symbols_md.app_src_index_css.product_card.l157 | evidence/03_symbols.md | 157-157 |
| ev.03_symbols_md.app_src_index_css.product_image_small.l158 | evidence/03_symbols.md | 158-158 |
| ev.03_symbols_md.app_src_index_css.page_heading.l159 | evidence/03_symbols.md | 159-159 |
| ev.03_symbols_md.app_src_index_css.products_page.l160 | evidence/03_symbols.md | 160-160 |
| ev.03_symbols_md.app_src_index_css.filters.l161 | evidence/03_symbols.md | 161-161 |
| ev.03_symbols_md.app_src_index_css.filters.l162 | evidence/03_symbols.md | 162-162 |
| ev.03_symbols_md.app_src_index_css.filters.l163 | evidence/03_symbols.md | 163-163 |
| ev.03_symbols_md.app_src_index_css.products_toolbar.l164 | evidence/03_symbols.md | 164-164 |
| ev.03_symbols_md.app_src_index_css.products_toolbar.l165 | evidence/03_symbols.md | 165-165 |
| ev.03_symbols_md.app_src_index_css.products_toolbar.l166 | evidence/03_symbols.md | 166-166 |
| ev.03_symbols_md.app_src_index_css.product_grid.l167 | evidence/03_symbols.md | 167-167 |
| ev.03_symbols_md.app_src_index_css.product_card.l168 | evidence/03_symbols.md | 168-168 |
| ev.03_symbols_md.app_src_index_css.product_card.l169 | evidence/03_symbols.md | 169-169 |
| ev.03_symbols_md.app_src_index_css.product_card_body.l170 | evidence/03_symbols.md | 170-170 |
| ev.03_symbols_md.app_src_index_css.product_card.l171 | evidence/03_symbols.md | 171-171 |
| ev.03_symbols_md.app_src_index_css.product_card.l172 | evidence/03_symbols.md | 172-172 |
| ev.03_symbols_md.app_src_index_css.product_card.l173 | evidence/03_symbols.md | 173-173 |
| ev.03_symbols_md.app_src_index_css.product_category.l174 | evidence/03_symbols.md | 174-174 |
| ev.03_symbols_md.app_src_index_css.product_description.l175 | evidence/03_symbols.md | 175-175 |
| ev.03_symbols_md.app_src_index_css.tag_list.l176 | evidence/03_symbols.md | 176-176 |
| ev.03_symbols_md.app_src_index_css.tag_list.l177 | evidence/03_symbols.md | 177-177 |
| ev.03_symbols_md.app_src_index_css.gift_label_list.l178 | evidence/03_symbols.md | 178-178 |
| ev.03_symbols_md.app_src_index_css.gift_label_list.l179 | evidence/03_symbols.md | 179-179 |
| ev.03_symbols_md.app_src_index_css.ai_reason.l180 | evidence/03_symbols.md | 180-180 |
| ev.03_symbols_md.app_src_index_css.product_card_footer.l181 | evidence/03_symbols.md | 181-181 |
| ev.03_symbols_md.app_src_index_css.product_card_price.l182 | evidence/03_symbols.md | 182-182 |
| ev.03_symbols_md.app_src_index_css.card_actions.l183 | evidence/03_symbols.md | 183-183 |
| ev.03_symbols_md.app_src_index_css.card_btn.l184 | evidence/03_symbols.md | 184-184 |
| ev.03_symbols_md.app_src_index_css.card_btn_detail.l185 | evidence/03_symbols.md | 185-185 |
| ev.03_symbols_md.app_src_index_css.card_btn_detail.l186 | evidence/03_symbols.md | 186-186 |
| ev.03_symbols_md.app_src_index_css.card_btn_add.l187 | evidence/03_symbols.md | 187-187 |
| ev.03_symbols_md.app_src_index_css.card_btn_add.l188 | evidence/03_symbols.md | 188-188 |
| ev.03_symbols_md.app_src_index_css.card_btn_add_added.l189 | evidence/03_symbols.md | 189-189 |
| ev.03_symbols_md.app_src_index_css.empty_state.l190 | evidence/03_symbols.md | 190-190 |
| ev.03_symbols_md.app_src_index_css.text_link.l191 | evidence/03_symbols.md | 191-191 |
| ev.03_symbols_md.app_src_index_css.detail_layout.l192 | evidence/03_symbols.md | 192-192 |
| ev.03_symbols_md.app_src_index_css.concierge_layout.l193 | evidence/03_symbols.md | 193-193 |
| ev.03_symbols_md.app_src_index_css.flow_layout.l194 | evidence/03_symbols.md | 194-194 |
| ev.03_symbols_md.app_src_index_css.checkout_layout.l195 | evidence/03_symbols.md | 195-195 |
| ev.03_symbols_md.app_src_index_css.detail_image.l196 | evidence/03_symbols.md | 196-196 |
| ev.03_symbols_md.app_src_index_css.detail_copy.l197 | evidence/03_symbols.md | 197-197 |
| ev.03_symbols_md.app_src_index_css.chat_panel.l198 | evidence/03_symbols.md | 198-198 |
| ev.03_symbols_md.app_src_index_css.result_panel.l199 | evidence/03_symbols.md | 199-199 |
| ev.03_symbols_md.app_src_index_css.summary_panel.l200 | evidence/03_symbols.md | 200-200 |
| ev.03_symbols_md.app_src_index_css.checkout_form.l201 | evidence/03_symbols.md | 201-201 |
| ev.03_symbols_md.app_src_index_css.complete_panel.l202 | evidence/03_symbols.md | 202-202 |
| ev.03_symbols_md.app_src_index_css.info_panel.l203 | evidence/03_symbols.md | 203-203 |
| ev.03_symbols_md.app_src_index_css.detail_copy.l204 | evidence/03_symbols.md | 204-204 |
| ev.03_symbols_md.app_src_index_css.chat_panel.l205 | evidence/03_symbols.md | 205-205 |
| ev.03_symbols_md.app_src_index_css.result_panel.l206 | evidence/03_symbols.md | 206-206 |
| ev.03_symbols_md.app_src_index_css.summary_panel.l207 | evidence/03_symbols.md | 207-207 |
| ev.03_symbols_md.app_src_index_css.checkout_form.l208 | evidence/03_symbols.md | 208-208 |
| ev.03_symbols_md.app_src_index_css.complete_panel.l209 | evidence/03_symbols.md | 209-209 |
| ev.03_symbols_md.app_src_index_css.detail_copy.l210 | evidence/03_symbols.md | 210-210 |
| ev.03_symbols_md.app_src_index_css.detail_copy.l211 | evidence/03_symbols.md | 211-211 |
| ev.03_symbols_md.app_src_index_css.info_panel.l212 | evidence/03_symbols.md | 212-212 |
| ev.03_symbols_md.app_src_index_css.info_panel.l213 | evidence/03_symbols.md | 213-213 |
| ev.03_symbols_md.app_src_index_css.result_panel.l214 | evidence/03_symbols.md | 214-214 |
| ev.03_symbols_md.app_src_index_css.cart_line.l215 | evidence/03_symbols.md | 215-215 |
| ev.03_symbols_md.app_src_index_css.order_card.l216 | evidence/03_symbols.md | 216-216 |
| ev.03_symbols_md.app_src_index_css.detail_actions.l217 | evidence/03_symbols.md | 217-217 |
| ev.03_symbols_md.app_src_index_css.detail_actions.l218 | evidence/03_symbols.md | 218-218 |
| ev.03_symbols_md.app_src_index_css.chat_panel.l219 | evidence/03_symbols.md | 219-219 |
| ev.03_symbols_md.app_src_index_css.checkout_form.l220 | evidence/03_symbols.md | 220-220 |
| ev.03_symbols_md.app_src_index_css.chat_panel.l221 | evidence/03_symbols.md | 221-221 |
| ev.03_symbols_md.app_src_index_css.chat_panel.l222 | evidence/03_symbols.md | 222-222 |
| ev.03_symbols_md.app_src_index_css.thinking_overlay.l223 | evidence/03_symbols.md | 223-223 |
| ev.03_symbols_md.app_src_index_css.thinking_header_row.l224 | evidence/03_symbols.md | 224-224 |
| ev.03_symbols_md.app_src_index_css.thinking_scan_bar.l225 | evidence/03_symbols.md | 225-225 |
| ev.03_symbols_md.app_src_index_css.thinking_scan_fill.l226 | evidence/03_symbols.md | 226-226 |
| ev.03_symbols_md.app_src_index_css.skeleton_list.l227 | evidence/03_symbols.md | 227-227 |
| ev.03_symbols_md.app_src_index_css.skeleton_card.l228 | evidence/03_symbols.md | 228-228 |
| ev.03_symbols_md.app_src_index_css.skeleton_image.l229 | evidence/03_symbols.md | 229-229 |
| ev.03_symbols_md.app_src_index_css.skeleton_body.l230 | evidence/03_symbols.md | 230-230 |
| ev.03_symbols_md.app_src_index_css.skeleton_line.l231 | evidence/03_symbols.md | 231-231 |
| ev.03_symbols_md.app_src_index_css.shimmer.l232 | evidence/03_symbols.md | 232-232 |
| ev.03_symbols_md.app_src_index_css.result_panel__empty.l233 | evidence/03_symbols.md | 233-233 |
| ev.03_symbols_md.app_src_index_css.result_hint.l234 | evidence/03_symbols.md | 234-234 |
| ev.03_symbols_md.app_src_index_css.result_summary.l235 | evidence/03_symbols.md | 235-235 |
| ev.03_symbols_md.app_src_index_css.follow_up.l236 | evidence/03_symbols.md | 236-236 |
| ev.03_symbols_md.app_src_index_css.turn_status.l237 | evidence/03_symbols.md | 237-237 |
| ev.03_symbols_md.app_src_index_css.success_message.l238 | evidence/03_symbols.md | 238-238 |
| ev.03_symbols_md.app_src_index_css.ai_status.l239 | evidence/03_symbols.md | 239-239 |
| ev.03_symbols_md.app_src_index_css.turn_status.l240 | evidence/03_symbols.md | 240-240 |
| ev.03_symbols_md.app_src_index_css.success_message.l241 | evidence/03_symbols.md | 241-241 |
| ev.03_symbols_md.app_src_index_css.ai_status.l242 | evidence/03_symbols.md | 242-242 |
| ev.03_symbols_md.app_src_index_css.recommendation_list.l243 | evidence/03_symbols.md | 243-243 |
| ev.03_symbols_md.app_src_index_css.line_list.l244 | evidence/03_symbols.md | 244-244 |
| ev.03_symbols_md.app_src_index_css.orders_list.l245 | evidence/03_symbols.md | 245-245 |
| ev.03_symbols_md.app_src_index_css.recommendation_card.l246 | evidence/03_symbols.md | 246-246 |
| ev.03_symbols_md.app_src_index_css.cart_line.l247 | evidence/03_symbols.md | 247-247 |
| ev.03_symbols_md.app_src_index_css.order_card.l248 | evidence/03_symbols.md | 248-248 |
| ev.03_symbols_md.app_src_index_css.recommendation_card.l249 | evidence/03_symbols.md | 249-249 |
| ev.03_symbols_md.app_src_index_css.recommendation_card.l250 | evidence/03_symbols.md | 250-250 |
| ev.03_symbols_md.app_src_index_css.cart_line.l251 | evidence/03_symbols.md | 251-251 |
| ev.03_symbols_md.app_src_index_css.order_card.l252 | evidence/03_symbols.md | 252-252 |
| ev.03_symbols_md.app_src_index_css.reason_breakdown.l253 | evidence/03_symbols.md | 253-253 |
| ev.03_symbols_md.app_src_index_css.reason_item.l254 | evidence/03_symbols.md | 254-254 |
| ev.03_symbols_md.app_src_index_css.reason_item.l255 | evidence/03_symbols.md | 255-255 |
| ev.03_symbols_md.app_src_index_css.reason_item.l256 | evidence/03_symbols.md | 256-256 |
| ev.03_symbols_md.app_src_index_css.comparison_toggle_row.l257 | evidence/03_symbols.md | 257-257 |
| ev.03_symbols_md.app_src_index_css.comparison_panel.l258 | evidence/03_symbols.md | 258-258 |
| ev.03_symbols_md.app_src_index_css.comparison_head.l259 | evidence/03_symbols.md | 259-259 |
| ev.03_symbols_md.app_src_index_css.comparison_head.l260 | evidence/03_symbols.md | 260-260 |
| ev.03_symbols_md.app_src_index_css.comparison_table.l261 | evidence/03_symbols.md | 261-261 |
| ev.03_symbols_md.app_src_index_css.comparison_row.l262 | evidence/03_symbols.md | 262-262 |
| ev.03_symbols_md.app_src_index_css.comparison_row.l263 | evidence/03_symbols.md | 263-263 |
| ev.03_symbols_md.app_src_index_css.comparison_row.l264 | evidence/03_symbols.md | 264-264 |
| ev.03_symbols_md.app_src_index_css.comparison_row.l265 | evidence/03_symbols.md | 265-265 |
| ev.03_symbols_md.app_src_index_css.comparison_row.l266 | evidence/03_symbols.md | 266-266 |
| ev.03_symbols_md.app_src_index_css.comparison_row__head.l267 | evidence/03_symbols.md | 267-267 |
| ev.03_symbols_md.app_src_index_css.comparison_row__head.l268 | evidence/03_symbols.md | 268-268 |
| ev.03_symbols_md.app_src_index_css.comparison_row.l269 | evidence/03_symbols.md | 269-269 |
| ev.03_symbols_md.app_src_index_css.comparison_best.l270 | evidence/03_symbols.md | 270-270 |
| ev.03_symbols_md.app_src_index_css.follow_up_panel.l271 | evidence/03_symbols.md | 271-271 |
| ev.03_symbols_md.app_src_index_css.follow_up_panel.l272 | evidence/03_symbols.md | 272-272 |
| ev.03_symbols_md.app_src_index_css.follow_up_answer.l273 | evidence/03_symbols.md | 273-273 |
| ev.03_symbols_md.app_src_index_css.follow_up_form.l274 | evidence/03_symbols.md | 274-274 |
| ev.03_symbols_md.app_src_index_css.follow_up_form.l275 | evidence/03_symbols.md | 275-275 |
| ev.03_symbols_md.app_src_index_css.follow_up_form.l276 | evidence/03_symbols.md | 276-276 |
| ev.03_symbols_md.app_src_index_css.follow_up_form.l277 | evidence/03_symbols.md | 277-277 |
| ev.03_symbols_md.app_src_index_css.follow_up_form.l278 | evidence/03_symbols.md | 278-278 |
| ev.03_symbols_md.app_src_index_css.follow_up_limit.l279 | evidence/03_symbols.md | 279-279 |
| ev.03_symbols_md.app_src_index_css.ai_context_panel.l280 | evidence/03_symbols.md | 280-280 |
| ev.03_symbols_md.app_src_index_css.context_query.l281 | evidence/03_symbols.md | 281-281 |
| ev.03_symbols_md.app_src_index_css.detail_reason_list.l282 | evidence/03_symbols.md | 282-282 |
| ev.03_symbols_md.app_src_index_css.recommendation_actions.l283 | evidence/03_symbols.md | 283-283 |
| ev.03_symbols_md.app_src_index_css.recommendation_actions.l284 | evidence/03_symbols.md | 284-284 |
| ev.03_symbols_md.app_src_index_css.recommendation_actions.l285 | evidence/03_symbols.md | 285-285 |
| ev.03_symbols_md.app_src_index_css.recommendation_actions.l286 | evidence/03_symbols.md | 286-286 |
| ev.03_symbols_md.app_src_index_css.recommendation_actions.l287 | evidence/03_symbols.md | 287-287 |
| ev.03_symbols_md.app_src_index_css.cart_line.l288 | evidence/03_symbols.md | 288-288 |
| ev.03_symbols_md.app_src_index_css.cart_line.l289 | evidence/03_symbols.md | 289-289 |
| ev.03_symbols_md.app_src_index_css.cart_line.l290 | evidence/03_symbols.md | 290-290 |
| ev.03_symbols_md.app_src_index_css.icon_button.l291 | evidence/03_symbols.md | 291-291 |
| ev.03_symbols_md.app_src_index_css.sr_only.l292 | evidence/03_symbols.md | 292-292 |
| ev.03_symbols_md.app_src_index_css.summary_panel.l293 | evidence/03_symbols.md | 293-293 |
| ev.03_symbols_md.app_src_index_css.summary_panel.l294 | evidence/03_symbols.md | 294-294 |
| ev.03_symbols_md.app_src_index_css.summary_panel.l295 | evidence/03_symbols.md | 295-295 |
| ev.03_symbols_md.app_src_index_css.summary_line.l296 | evidence/03_symbols.md | 296-296 |
| ev.03_symbols_md.app_src_index_css.order_facts.l297 | evidence/03_symbols.md | 297-297 |
| ev.03_symbols_md.app_src_index_css.summary_line.l298 | evidence/03_symbols.md | 298-298 |
| ev.03_symbols_md.app_src_index_css.order_facts.l299 | evidence/03_symbols.md | 299-299 |
| ev.03_symbols_md.app_src_index_css.summary_line_total.l300 | evidence/03_symbols.md | 300-300 |
| ev.03_symbols_md.app_src_index_css.complete_panel.l301 | evidence/03_symbols.md | 301-301 |
| ev.03_symbols_md.app_src_index_css.complete_panel.l302 | evidence/03_symbols.md | 302-302 |
| ev.03_symbols_md.app_src_index_css.complete_panel.l303 | evidence/03_symbols.md | 303-303 |
| ev.03_symbols_md.app_src_index_css.order_facts.l304 | evidence/03_symbols.md | 304-304 |
| ev.03_symbols_md.app_src_index_css.order_facts.l305 | evidence/03_symbols.md | 305-305 |
| ev.03_symbols_md.app_src_index_css.order_facts.l306 | evidence/03_symbols.md | 306-306 |
| ev.03_symbols_md.app_src_index_css.gift_message_panel.l307 | evidence/03_symbols.md | 307-307 |
| ev.03_symbols_md.app_src_index_css.gift_message_panel.l308 | evidence/03_symbols.md | 308-308 |
| ev.03_symbols_md.app_src_index_css.gift_message_panel.l309 | evidence/03_symbols.md | 309-309 |
| ev.03_symbols_md.app_src_index_css.gift_message_panel.l310 | evidence/03_symbols.md | 310-310 |
| ev.03_symbols_md.app_src_index_css.gift_message_result.l311 | evidence/03_symbols.md | 311-311 |
| ev.03_symbols_md.app_src_index_css.gift_message_result.l312 | evidence/03_symbols.md | 312-312 |
| ev.03_symbols_md.app_src_index_css.gift_message_result.l313 | evidence/03_symbols.md | 313-313 |
| ev.03_symbols_md.app_src_index_css.gift_message_status.l314 | evidence/03_symbols.md | 314-314 |
| ev.03_symbols_md.app_src_index_css.order_card.l315 | evidence/03_symbols.md | 315-315 |
| ev.03_symbols_md.app_src_index_css.order_items.l316 | evidence/03_symbols.md | 316-316 |
| ev.03_symbols_md.app_src_index_css.order_items.l317 | evidence/03_symbols.md | 317-317 |
| ev.03_symbols_md.app_src_index_css.metric_grid.l318 | evidence/03_symbols.md | 318-318 |
| ev.03_symbols_md.app_src_index_css.metric_card.l319 | evidence/03_symbols.md | 319-319 |
| ev.03_symbols_md.app_src_index_css.dashboard_panel.l320 | evidence/03_symbols.md | 320-320 |
| ev.03_symbols_md.app_src_index_css.improvement_panel.l321 | evidence/03_symbols.md | 321-321 |
| ev.03_symbols_md.app_src_index_css.metric_card.l322 | evidence/03_symbols.md | 322-322 |
| ev.03_symbols_md.app_src_index_css.metric_icon.l323 | evidence/03_symbols.md | 323-323 |
| ev.03_symbols_md.app_src_index_css.metric_card.l324 | evidence/03_symbols.md | 324-324 |
| ev.03_symbols_md.app_src_index_css.metric_card.l325 | evidence/03_symbols.md | 325-325 |
| ev.03_symbols_md.app_src_index_css.metric_card.l326 | evidence/03_symbols.md | 326-326 |
| ev.03_symbols_md.app_src_index_css.admin_grid.l327 | evidence/03_symbols.md | 327-327 |
| ev.03_symbols_md.app_src_index_css.dashboard_panel.l328 | evidence/03_symbols.md | 328-328 |
| ev.03_symbols_md.app_src_index_css.improvement_panel.l329 | evidence/03_symbols.md | 329-329 |
| ev.03_symbols_md.app_src_index_css.dashboard_panel.l330 | evidence/03_symbols.md | 330-330 |
| ev.03_symbols_md.app_src_index_css.improvement_panel.l331 | evidence/03_symbols.md | 331-331 |
| ev.03_symbols_md.app_src_index_css.rank_list.l332 | evidence/03_symbols.md | 332-332 |
| ev.03_symbols_md.app_src_index_css.rank_list.l333 | evidence/03_symbols.md | 333-333 |
| ev.03_symbols_md.app_src_index_css.rank_list.l334 | evidence/03_symbols.md | 334-334 |
| ev.03_symbols_md.app_src_index_css.rank_list.l335 | evidence/03_symbols.md | 335-335 |
| ev.03_symbols_md.app_src_index_css.rank_list.l336 | evidence/03_symbols.md | 336-336 |
| ev.03_symbols_md.app_src_index_css.rank_list.l337 | evidence/03_symbols.md | 337-337 |
| ev.03_symbols_md.app_src_index_css.admin_empty.l338 | evidence/03_symbols.md | 338-338 |
| ev.03_symbols_md.app_src_index_css.suggestion_item.l339 | evidence/03_symbols.md | 339-339 |
| ev.03_symbols_md.app_src_index_css.suggestion_num.l340 | evidence/03_symbols.md | 340-340 |
| ev.03_symbols_md.app_src_index_css.suggestion_item.l341 | evidence/03_symbols.md | 341-341 |
| ev.03_symbols_md.app_src_index_css.suggestion_item.l342 | evidence/03_symbols.md | 342-342 |
| ev.03_symbols_md.app_src_index_css.improvement_subtitle.l343 | evidence/03_symbols.md | 343-343 |
| ev.03_symbols_md.app_src_index_css.suggestion_link.l344 | evidence/03_symbols.md | 344-344 |
| ev.03_symbols_md.app_src_index_css.suggestion_link.l345 | evidence/03_symbols.md | 345-345 |
| ev.03_symbols_md.app_src_index_css.gap_panel.l346 | evidence/03_symbols.md | 346-346 |
| ev.03_symbols_md.app_src_index_css.gap_panel.l347 | evidence/03_symbols.md | 347-347 |
| ev.03_symbols_md.app_src_index_css.gap_list.l348 | evidence/03_symbols.md | 348-348 |
| ev.03_symbols_md.app_src_index_css.gap_item.l349 | evidence/03_symbols.md | 349-349 |
| ev.03_symbols_md.app_src_index_css.gap_item.l350 | evidence/03_symbols.md | 350-350 |
| ev.03_symbols_md.app_src_index_css.gap_item.l351 | evidence/03_symbols.md | 351-351 |
| ev.03_symbols_md.app_src_index_css.hero_copy.l352 | evidence/03_symbols.md | 352-352 |
| ev.03_symbols_md.app_src_index_css.hero_alt.l353 | evidence/03_symbols.md | 353-353 |
| ev.03_symbols_md.app_src_index_css.hero_alt.l354 | evidence/03_symbols.md | 354-354 |
| ev.03_symbols_md.app_src_index_css.hero_alt.l355 | evidence/03_symbols.md | 355-355 |
| ev.03_symbols_md.app_src_index_css.concierge_slip.l356 | evidence/03_symbols.md | 356-356 |
| ev.03_symbols_md.app_src_index_css.slip_head.l357 | evidence/03_symbols.md | 357-357 |
| ev.03_symbols_md.app_src_index_css.slip_eyebrow.l358 | evidence/03_symbols.md | 358-358 |
| ev.03_symbols_md.app_src_index_css.slip_count.l359 | evidence/03_symbols.md | 359-359 |
| ev.03_symbols_md.app_src_index_css.slip_list.l360 | evidence/03_symbols.md | 360-360 |
| ev.03_symbols_md.app_src_index_css.slip_item.l361 | evidence/03_symbols.md | 361-361 |
| ev.03_symbols_md.app_src_index_css.slip_item.l362 | evidence/03_symbols.md | 362-362 |
| ev.03_symbols_md.app_src_index_css.slip_media.l363 | evidence/03_symbols.md | 363-363 |
| ev.03_symbols_md.app_src_index_css.slip_media.l364 | evidence/03_symbols.md | 364-364 |
| ev.03_symbols_md.app_src_index_css.slip_cat.l365 | evidence/03_symbols.md | 365-365 |
| ev.03_symbols_md.app_src_index_css.slip_name.l366 | evidence/03_symbols.md | 366-366 |
| ev.03_symbols_md.app_src_index_css.slip_reason.l367 | evidence/03_symbols.md | 367-367 |
| ev.03_symbols_md.app_src_index_css.slip_foot.l368 | evidence/03_symbols.md | 368-368 |
| ev.03_symbols_md.app_src_index_css.section_head.l369 | evidence/03_symbols.md | 369-369 |
| ev.03_symbols_md.app_src_index_css.section_head__center.l370 | evidence/03_symbols.md | 370-370 |
| ev.03_symbols_md.app_src_index_css.section_title.l371 | evidence/03_symbols.md | 371-371 |
| ev.03_symbols_md.app_src_index_css.section_link.l372 | evidence/03_symbols.md | 372-372 |
| ev.03_symbols_md.app_src_index_css.section_link.l373 | evidence/03_symbols.md | 373-373 |
| ev.03_symbols_md.app_src_index_css.value_section.l374 | evidence/03_symbols.md | 374-374 |
| ev.03_symbols_md.app_src_index_css.value_grid.l375 | evidence/03_symbols.md | 375-375 |
| ev.03_symbols_md.app_src_index_css.step_card.l376 | evidence/03_symbols.md | 376-376 |
| ev.03_symbols_md.app_src_index_css.step_card.l377 | evidence/03_symbols.md | 377-377 |
| ev.03_symbols_md.app_src_index_css.step_badge.l378 | evidence/03_symbols.md | 378-378 |
| ev.03_symbols_md.app_src_index_css.step_card.l379 | evidence/03_symbols.md | 379-379 |
| ev.03_symbols_md.app_src_index_css.step_card.l380 | evidence/03_symbols.md | 380-380 |
| ev.03_symbols_md.app_src_index_css.step_link.l381 | evidence/03_symbols.md | 381-381 |
| ev.03_symbols_md.app_src_index_css.step_link.l382 | evidence/03_symbols.md | 382-382 |
| ev.03_symbols_md.app_src_index_css.featured_section.l383 | evidence/03_symbols.md | 383-383 |
| ev.03_symbols_md.app_src_index_css.feature_grid.l384 | evidence/03_symbols.md | 384-384 |
| ev.03_symbols_md.app_src_index_css.feature_card.l385 | evidence/03_symbols.md | 385-385 |
| ev.03_symbols_md.app_src_index_css.feature_card.l386 | evidence/03_symbols.md | 386-386 |
| ev.03_symbols_md.app_src_index_css.feature_media.l387 | evidence/03_symbols.md | 387-387 |
| ev.03_symbols_md.app_src_index_css.feature_media.l388 | evidence/03_symbols.md | 388-388 |
| ev.03_symbols_md.app_src_index_css.feature_card.l389 | evidence/03_symbols.md | 389-389 |
| ev.03_symbols_md.app_src_index_css.feature_body.l390 | evidence/03_symbols.md | 390-390 |
| ev.03_symbols_md.app_src_index_css.feature_cat.l391 | evidence/03_symbols.md | 391-391 |
| ev.03_symbols_md.app_src_index_css.feature_name.l392 | evidence/03_symbols.md | 392-392 |
| ev.03_symbols_md.app_src_index_css.feature_foot.l393 | evidence/03_symbols.md | 393-393 |
| ev.03_symbols_md.app_src_index_css.feature_price.l394 | evidence/03_symbols.md | 394-394 |
| ev.03_symbols_md.app_src_index_css.feature_go.l395 | evidence/03_symbols.md | 395-395 |
| ev.03_symbols_md.app_src_index_css.closing_cta.l396 | evidence/03_symbols.md | 396-396 |
| ev.03_symbols_md.app_src_index_css.closing_inner.l397 | evidence/03_symbols.md | 397-397 |
| ev.03_symbols_md.app_src_index_css.closing_eyebrow.l398 | evidence/03_symbols.md | 398-398 |
| ev.03_symbols_md.app_src_index_css.closing_title.l399 | evidence/03_symbols.md | 399-399 |
| ev.03_symbols_md.app_src_index_css.closing_lead.l400 | evidence/03_symbols.md | 400-400 |
| ev.03_symbols_md.app_src_index_css.closing_actions.l401 | evidence/03_symbols.md | 401-401 |
| ev.03_symbols_md.app_src_index_css.closing_primary.l402 | evidence/03_symbols.md | 402-402 |
| ev.03_symbols_md.app_src_index_css.closing_primary.l403 | evidence/03_symbols.md | 403-403 |
| ev.03_symbols_md.app_src_index_css.closing_secondary.l404 | evidence/03_symbols.md | 404-404 |
| ev.03_symbols_md.app_src_index_css.closing_insight.l405 | evidence/03_symbols.md | 405-405 |
| ev.03_symbols_md.app_src_index_css.closing_secondary.l406 | evidence/03_symbols.md | 406-406 |
| ev.03_symbols_md.app_src_index_css.improvement_panel.l407 | evidence/03_symbols.md | 407-407 |
| ev.03_symbols_md.app_src_index_css.improvement_head.l408 | evidence/03_symbols.md | 408-408 |
| ev.03_symbols_md.app_src_index_css.improvement_head.l409 | evidence/03_symbols.md | 409-409 |
| ev.03_symbols_md.app_src_index_css.suggestion_list.l410 | evidence/03_symbols.md | 410-410 |
| ev.03_symbols_md.app_src_index_css.suggestion_list.l411 | evidence/03_symbols.md | 411-411 |
| ev.03_symbols_md.app_src_index_css.hero_section.l412 | evidence/03_symbols.md | 412-412 |
| ev.03_symbols_md.app_src_index_css.filters.l413 | evidence/03_symbols.md | 413-413 |
| ev.03_symbols_md.app_src_index_css.product_grid.l414 | evidence/03_symbols.md | 414-414 |
| ev.03_symbols_md.app_src_index_css.value_grid.l415 | evidence/03_symbols.md | 415-415 |
| ev.03_symbols_md.app_src_index_css.metric_grid.l416 | evidence/03_symbols.md | 416-416 |
| ev.03_symbols_md.app_src_index_css.admin_grid.l417 | evidence/03_symbols.md | 417-417 |
| ev.03_symbols_md.app_src_index_css.improvement_panel.l418 | evidence/03_symbols.md | 418-418 |
| ev.03_symbols_md.app_src_index_css.detail_layout.l419 | evidence/03_symbols.md | 419-419 |
| ev.03_symbols_md.app_src_index_css.concierge_layout.l420 | evidence/03_symbols.md | 420-420 |
| ev.03_symbols_md.app_src_index_css.flow_layout.l421 | evidence/03_symbols.md | 421-421 |
| ev.03_symbols_md.app_src_index_css.checkout_layout.l422 | evidence/03_symbols.md | 422-422 |
| ev.03_symbols_md.app_src_index_css.summary_panel.l423 | evidence/03_symbols.md | 423-423 |
| ev.03_symbols_md.app_src_index_css.site_header.l424 | evidence/03_symbols.md | 424-424 |
| ev.03_symbols_md.app_src_index_css.header_logo.l425 | evidence/03_symbols.md | 425-425 |
| ev.03_symbols_md.app_src_index_css.header_nav.l426 | evidence/03_symbols.md | 426-426 |
| ev.03_symbols_md.app_src_index_css.header_nav.l427 | evidence/03_symbols.md | 427-427 |
| ev.03_symbols_md.app_src_index_css.header_nav.l428 | evidence/03_symbols.md | 428-428 |
| ev.03_symbols_md.app_src_index_css.checkout_steps.l429 | evidence/03_symbols.md | 429-429 |
| ev.03_symbols_md.app_src_index_css.step_done.l430 | evidence/03_symbols.md | 430-430 |
| ev.03_symbols_md.app_src_index_css.step_pending.l431 | evidence/03_symbols.md | 431-431 |
| ev.03_symbols_md.app_src_index_css.step.l432 | evidence/03_symbols.md | 432-432 |
| ev.03_symbols_md.app_src_index_css.gift_message_result.l433 | evidence/03_symbols.md | 433-433 |
| ev.03_symbols_md.app_src_index_css.site_page.l434 | evidence/03_symbols.md | 434-434 |
| ev.03_symbols_md.app_src_index_css.hero_section.l435 | evidence/03_symbols.md | 435-435 |
| ev.03_symbols_md.app_src_index_css.lead.l436 | evidence/03_symbols.md | 436-436 |
| ev.03_symbols_md.app_src_index_css.hero_search.l437 | evidence/03_symbols.md | 437-437 |
| ev.03_symbols_md.app_src_index_css.hero_search.l438 | evidence/03_symbols.md | 438-438 |
| ev.03_symbols_md.app_src_index_css.hero_search.l439 | evidence/03_symbols.md | 439-439 |
| ev.03_symbols_md.app_src_index_css.follow_up_form.l440 | evidence/03_symbols.md | 440-440 |
| ev.03_symbols_md.app_src_index_css.cta_row.l441 | evidence/03_symbols.md | 441-441 |
| ev.03_symbols_md.app_src_index_css.cta_row.l442 | evidence/03_symbols.md | 442-442 |
| ev.03_symbols_md.app_src_index_css.guided_submit.l443 | evidence/03_symbols.md | 443-443 |
| ev.03_symbols_md.app_src_index_css.products_toolbar.l444 | evidence/03_symbols.md | 444-444 |
| ev.03_symbols_md.app_src_index_css.ai_sort.l445 | evidence/03_symbols.md | 445-445 |
| ev.03_symbols_md.app_src_index_css.products_toolbar.l446 | evidence/03_symbols.md | 446-446 |
| ev.03_symbols_md.app_src_index_css.filters.l447 | evidence/03_symbols.md | 447-447 |
| ev.03_symbols_md.app_src_index_css.cart_line.l448 | evidence/03_symbols.md | 448-448 |
| ev.03_symbols_md.app_src_index_css.order_card.l449 | evidence/03_symbols.md | 449-449 |
| ev.03_symbols_md.app_src_index_css.chat_panel.l450 | evidence/03_symbols.md | 450-450 |
| ev.03_symbols_md.app_src_index_css.recommendation_card.l451 | evidence/03_symbols.md | 451-451 |
| ev.03_symbols_md.app_src_index_css.recommendation_card.l452 | evidence/03_symbols.md | 452-452 |
| ev.03_symbols_md.app_src_index_css.product_grid.l453 | evidence/03_symbols.md | 453-453 |
| ev.03_symbols_md.app_src_index_css.product_card.l454 | evidence/03_symbols.md | 454-454 |
| ev.03_symbols_md.app_src_index_css.product_image.l455 | evidence/03_symbols.md | 455-455 |
| ev.03_symbols_md.app_src_index_css.product_card_body.l456 | evidence/03_symbols.md | 456-456 |
| ev.03_symbols_md.app_src_index_css.product_card.l457 | evidence/03_symbols.md | 457-457 |
| ev.03_symbols_md.app_src_index_css.product_card.l458 | evidence/03_symbols.md | 458-458 |
| ev.03_symbols_md.app_src_index_css.product_card_footer.l459 | evidence/03_symbols.md | 459-459 |
| ev.03_symbols_md.app_src_index_css.product_card_price.l460 | evidence/03_symbols.md | 460-460 |
| ev.03_symbols_md.app_src_index_css.card_actions.l461 | evidence/03_symbols.md | 461-461 |
| ev.03_symbols_md.app_src_index_css.card_btn.l462 | evidence/03_symbols.md | 462-462 |
| ev.03_symbols_md.app_src_index_css.value_grid.l463 | evidence/03_symbols.md | 463-463 |
| ev.03_symbols_md.app_src_index_css.metric_grid.l464 | evidence/03_symbols.md | 464-464 |
| ev.03_symbols_md.app_src_index_css.detail_image.l465 | evidence/03_symbols.md | 465-465 |
| ev.03_symbols_md.app_src_index_css.order_facts.l466 | evidence/03_symbols.md | 466-466 |
| ev.03_symbols_md.app_src_index_css.summary_line.l467 | evidence/03_symbols.md | 467-467 |
| ev.03_symbols_md.app_src_index_css.order_facts.l468 | evidence/03_symbols.md | 468-468 |
| ev.03_symbols_md.app_src_index_css.site_footer.l469 | evidence/03_symbols.md | 469-469 |
| ev.03_symbols_md.app_src_index_css.footer_inner.l470 | evidence/03_symbols.md | 470-470 |
| ev.03_symbols_md.app_src_index_css.footer_logo.l471 | evidence/03_symbols.md | 471-471 |
| ev.03_symbols_md.app_src_index_css.footer_tagline.l472 | evidence/03_symbols.md | 472-472 |
| ev.03_symbols_md.app_src_index_css.footer_nav_heading.l473 | evidence/03_symbols.md | 473-473 |
| ev.03_symbols_md.app_src_index_css.footer_nav.l474 | evidence/03_symbols.md | 474-474 |
| ev.03_symbols_md.app_src_index_css.footer_nav.l475 | evidence/03_symbols.md | 475-475 |
| ev.03_symbols_md.app_src_index_css.footer_nav.l476 | evidence/03_symbols.md | 476-476 |
| ev.03_symbols_md.app_src_index_css.footer_info.l477 | evidence/03_symbols.md | 477-477 |
| ev.03_symbols_md.app_src_index_css.footer_info.l478 | evidence/03_symbols.md | 478-478 |
| ev.03_symbols_md.app_src_index_css.footer_bottom.l479 | evidence/03_symbols.md | 479-479 |
| ev.03_symbols_md.app_src_index_css.footer_bottom.l480 | evidence/03_symbols.md | 480-480 |
| ev.03_symbols_md.app_src_index_css.footer_note.l481 | evidence/03_symbols.md | 481-481 |
| ev.03_symbols_md.app_src_index_css.footer_admin_entry.l482 | evidence/03_symbols.md | 482-482 |
| ev.03_symbols_md.app_src_index_css.footer_admin_entry.l483 | evidence/03_symbols.md | 483-483 |
| ev.03_symbols_md.app_src_index_css.footer_admin_entry.l484 | evidence/03_symbols.md | 484-484 |
| ev.03_symbols_md.app_src_index_css.footer_inner.l485 | evidence/03_symbols.md | 485-485 |
| ev.03_symbols_md.app_src_index_css.footer_brand.l486 | evidence/03_symbols.md | 486-486 |
| ev.03_symbols_md.app_src_index_css.footer_inner.l487 | evidence/03_symbols.md | 487-487 |
| ev.03_symbols_md.app_src_index_css.footer_bottom.l488 | evidence/03_symbols.md | 488-488 |
| ev.03_symbols_md.app_src_index_css.feature_grid.l489 | evidence/03_symbols.md | 489-489 |
| ev.03_symbols_md.app_src_index_css.concierge_slip.l490 | evidence/03_symbols.md | 490-490 |
| ev.03_symbols_md.app_src_index_css.hero_copy.l491 | evidence/03_symbols.md | 491-491 |
| ev.03_symbols_md.app_src_index_css.section_head.l492 | evidence/03_symbols.md | 492-492 |
| ev.03_symbols_md.app_src_index_css.section_head__center.l493 | evidence/03_symbols.md | 493-493 |
| ev.03_symbols_md.app_src_index_css.feature_grid.l494 | evidence/03_symbols.md | 494-494 |
| ev.03_symbols_md.app_src_index_css.closing_actions.l495 | evidence/03_symbols.md | 495-495 |
| ev.03_symbols_md.app_src_index_css.closing_primary.l496 | evidence/03_symbols.md | 496-496 |
| ev.03_symbols_md.app_src_index_css.closing_secondary.l497 | evidence/03_symbols.md | 497-497 |
| ev.03_symbols_md.app_src_index_css.sample_badge.l498 | evidence/03_symbols.md | 498-498 |
| ev.03_symbols_md.app_src_index_css.sample_badge.l499 | evidence/03_symbols.md | 499-499 |
| ev.03_symbols_md.app_src_index_css.ai_trust_note.l500 | evidence/03_symbols.md | 500-500 |
| ev.03_symbols_md.app_src_index_css.ai_trust_note.l501 | evidence/03_symbols.md | 501-501 |
| ev.03_symbols_md.app_src_index_css.about_proofs.l502 | evidence/03_symbols.md | 502-502 |
| ev.03_symbols_md.app_src_index_css.about_proof.l503 | evidence/03_symbols.md | 503-503 |
| ev.03_symbols_md.app_src_index_css.about_proof_icon.l504 | evidence/03_symbols.md | 504-504 |
| ev.03_symbols_md.app_src_index_css.about_proof.l505 | evidence/03_symbols.md | 505-505 |
| ev.03_symbols_md.app_src_index_css.about_proof.l506 | evidence/03_symbols.md | 506-506 |
| ev.03_symbols_md.app_src_index_css.about_stack.l507 | evidence/03_symbols.md | 507-507 |
| ev.03_symbols_md.app_src_index_css.about_stack.l508 | evidence/03_symbols.md | 508-508 |
| ev.03_symbols_md.app_src_index_css.about_stack.l509 | evidence/03_symbols.md | 509-509 |
| ev.03_symbols_md.app_src_index_css.about_role.l510 | evidence/03_symbols.md | 510-510 |
| ev.03_symbols_md.app_src_index_css.about_back.l511 | evidence/03_symbols.md | 511-511 |
| ev.03_symbols_md.app_src_index_css.about_back.l512 | evidence/03_symbols.md | 512-512 |
| ev.03_symbols_md.app_src_index_css.footer_about_link.l513 | evidence/03_symbols.md | 513-513 |
| ev.03_symbols_md.app_src_index_css.footer_about_link.l514 | evidence/03_symbols.md | 514-514 |
| ev.03_symbols_md.app_src_index_css.about_proofs.l515 | evidence/03_symbols.md | 515-515 |
| ev.03_symbols_md.app_src_lib_ailimit_js.ailimitexceedederror.l519 | evidence/03_symbols.md | 519-519 |
| ev.03_symbols_md.app_src_lib_ailimit_js.ensurecurrentlimitsignature.l520 | evidence/03_symbols.md | 520-520 |
| ev.03_symbols_md.app_src_lib_ailimit_js.consumeailimit.l521 | evidence/03_symbols.md | 521-521 |
| ev.03_symbols_md.app_src_lib_ailimit_js.getaiusagetoday.l522 | evidence/03_symbols.md | 522-522 |
| ev.03_symbols_md.app_src_lib_ailimit_js.getaidailylimit.l523 | evidence/03_symbols.md | 523-523 |
| ev.03_symbols_md.app_src_lib_cart_js.cart_key.l527 | evidence/03_symbols.md | 527-527 |
| ev.03_symbols_md.app_src_lib_cart_js.orders_key.l528 | evidence/03_symbols.md | 528-528 |
| ev.03_symbols_md.app_src_lib_cart_js.ai_context_key.l529 | evidence/03_symbols.md | 529-529 |
| ev.03_symbols_md.app_src_lib_cart_js.consultations_key.l530 | evidence/03_symbols.md | 530-530 |
| ev.03_symbols_md.app_src_lib_cart_js.cart_events_key.l531 | evidence/03_symbols.md | 531-531 |
| ev.03_symbols_md.app_src_lib_cart_js.getcart.l532 | evidence/03_symbols.md | 532-532 |
| ev.03_symbols_md.app_src_lib_cart_js.savecart.l533 | evidence/03_symbols.md | 533-533 |
| ev.03_symbols_md.app_src_lib_cart_js.addtocart.l534 | evidence/03_symbols.md | 534-534 |
| ev.03_symbols_md.app_src_lib_cart_js.updatecartquantity.l535 | evidence/03_symbols.md | 535-535 |
| ev.03_symbols_md.app_src_lib_cart_js.removefromcart.l536 | evidence/03_symbols.md | 536-536 |
| ev.03_symbols_md.app_src_lib_cart_js.clearcart.l537 | evidence/03_symbols.md | 537-537 |
| ev.03_symbols_md.app_src_lib_cart_js.getorders.l538 | evidence/03_symbols.md | 538-538 |
| ev.03_symbols_md.app_src_lib_cart_js.saveorder.l539 | evidence/03_symbols.md | 539-539 |
| ev.03_symbols_md.app_src_lib_cart_js.saveaicontext.l540 | evidence/03_symbols.md | 540-540 |
| ev.03_symbols_md.app_src_lib_cart_js.getaicontext.l541 | evidence/03_symbols.md | 541-541 |
| ev.03_symbols_md.app_src_lib_cart_js.getconsultations.l542 | evidence/03_symbols.md | 542-542 |
| ev.03_symbols_md.app_src_lib_cart_js.recordconsultation.l543 | evidence/03_symbols.md | 543-543 |
| ev.03_symbols_md.app_src_lib_cart_js.getcartevents.l544 | evidence/03_symbols.md | 544-544 |
| ev.03_symbols_md.app_src_lib_cart_js.recordcartevent.l545 | evidence/03_symbols.md | 545-545 |
| ev.03_symbols_md.app_src_lib_cart_js.createordernumber.l546 | evidence/03_symbols.md | 546-546 |
| ev.03_symbols_md.app_src_lib_cart_js.readjson.l547 | evidence/03_symbols.md | 547-547 |
| ev.03_symbols_md.app_src_lib_giftlabels_js.getgiftlabels.l551 | evidence/03_symbols.md | 551-551 |
| ev.03_symbols_md.app_src_lib_giftlabels_js.getgiftfitprofile.l552 | evidence/03_symbols.md | 552-552 |
| ev.03_symbols_md.app_src_lib_giftlabels_js.getcomparisonrows.l553 | evidence/03_symbols.md | 553-553 |
| ev.03_symbols_md.app_src_lib_giftlabels_js.formatpriceband.l554 | evidence/03_symbols.md | 554-554 |
| ev.03_symbols_md.app_src_lib_motion_js.ease.l558 | evidence/03_symbols.md | 558-558 |
| ev.03_symbols_md.app_src_lib_supabase_js.recommendproducts.l562 | evidence/03_symbols.md | 562-562 |
| ev.03_symbols_md.app_src_lib_supabase_js.askconcierge.l563 | evidence/03_symbols.md | 563-563 |
| ev.03_symbols_md.app_src_lib_supabase_js.generategiftmessage.l564 | evidence/03_symbols.md | 564-564 |
| ev.03_symbols_md.app_src_lib_viewtransition_js.startviewtransition.l568 | evidence/03_symbols.md | 568-568 |
| ev.03_symbols_md.app_src_pages_about_jsx.about.l572 | evidence/03_symbols.md | 572-572 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.admindemo.l576 | evidence/03_symbols.md | 576-576 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.countup.l577 | evidence/03_symbols.md | 577-577 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.metriccard.l578 | evidence/03_symbols.md | 578-578 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.dashboardpanel.l579 | evidence/03_symbols.md | 579-579 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.emptyadminstate.l580 | evidence/03_symbols.md | 580-580 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.rankconsultationtopics.l581 | evidence/03_symbols.md | 581-581 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.rankproducts.l582 | evidence/03_symbols.md | 582-582 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.detectproductgaps.l583 | evidence/03_symbols.md | 583-583 |
| ev.03_symbols_md.app_src_pages_admindemo_jsx.countmatchingproducts.l584 | evidence/03_symbols.md | 584-584 |
| ev.03_symbols_md.app_src_pages_cart_jsx.cart.l588 | evidence/03_symbols.md | 588-588 |
| ev.03_symbols_md.app_src_pages_cart_jsx.formatprice.l589 | evidence/03_symbols.md | 589-589 |
| ev.03_symbols_md.app_src_pages_checkout_jsx.demo_items.l593 | evidence/03_symbols.md | 593-593 |
| ev.03_symbols_md.app_src_pages_checkout_jsx.checkout.l594 | evidence/03_symbols.md | 594-594 |
| ev.03_symbols_md.app_src_pages_checkout_jsx.formatprice.l595 | evidence/03_symbols.md | 595-595 |
| ev.03_symbols_md.app_src_pages_complete_jsx.complete.l599 | evidence/03_symbols.md | 599-599 |
| ev.03_symbols_md.app_src_pages_complete_jsx.readlastorder.l600 | evidence/03_symbols.md | 600-600 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.max_concierge_turns.l604 | evidence/03_symbols.md | 604-604 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.concierge.l605 | evidence/03_symbols.md | 605-605 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.giftlabellist.l606 | evidence/03_symbols.md | 606-606 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.giftcomparison.l607 | evidence/03_symbols.md | 607-607 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.reasonitem.l608 | evidence/03_symbols.md | 608-608 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.toconciergecandidate.l609 | evidence/03_symbols.md | 609-609 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.getfollowupoptions.l610 | evidence/03_symbols.md | 610-610 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.normalizeconciergeresponse.l611 | evidence/03_symbols.md | 611-611 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.normalizerecommendation.l612 | evidence/03_symbols.md | 612-612 |
| ev.03_symbols_md.app_src_pages_concierge_jsx.normalizetext.l613 | evidence/03_symbols.md | 613-613 |
| ev.03_symbols_md.app_src_pages_orders_jsx.orders.l617 | evidence/03_symbols.md | 617-617 |
| ev.03_symbols_md.app_src_pages_productdetail_jsx.productdetail.l621 | evidence/03_symbols.md | 621-621 |
| ev.03_symbols_md.app_src_pages_productdetail_jsx.buildfrequentreasons.l622 | evidence/03_symbols.md | 622-622 |
| ev.03_symbols_md.app_src_pages_products_jsx.products.l626 | evidence/03_symbols.md | 626-626 |
| ev.03_symbols_md.app_src_pages_top_jsx.top.l630 | evidence/03_symbols.md | 630-630 |
| ev.03_symbols_md.app_src_pages_top_jsx.buildguidedmessage.l631 | evidence/03_symbols.md | 631-631 |
| ev.03_symbols_md.app_vite_config_js.ai_daily_limit.l635 | evidence/03_symbols.md | 635-635 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.deepseek_api_key.l639 | evidence/03_symbols.md | 639-639 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.deepseek_model.l640 | evidence/03_symbols.md | 640-640 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.max_query_length.l641 | evidence/03_symbols.md | 641-641 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.max_candidates.l642 | evidence/03_symbols.md | 642-642 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.fallback_gift_message.l643 | evidence/03_symbols.md | 643-643 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.cors.l644 | evidence/03_symbols.md | 644-644 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.fallback_response.l645 | evidence/03_symbols.md | 645-645 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.generategiftmessage.l646 | evidence/03_symbols.md | 646-646 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.normalizegiftmessage.l647 | evidence/03_symbols.md | 647-647 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.normalizecandidates.l648 | evidence/03_symbols.md | 648-648 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.normalizemodelresponse.l649 | evidence/03_symbols.md | 649-649 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.rankrecommendations.l650 | evidence/03_symbols.md | 650-650 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.scoresensitivefit.l651 | evidence/03_symbols.md | 651-651 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.normalizerecommendation.l652 | evidence/03_symbols.md | 652-652 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.normalizestringarray.l653 | evidence/03_symbols.md | 653-653 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.normalizetext.l654 | evidence/03_symbols.md | 654-654 |
| ev.03_symbols_md.supabase_functions_concierge_index_ts.json.l655 | evidence/03_symbols.md | 655-655 |
| ev.03_symbols_md.supabase_functions_recommend_products_index_ts.deepseek_api_key.l659 | evidence/03_symbols.md | 659-659 |
| ev.03_symbols_md.supabase_functions_recommend_products_index_ts.deepseek_model.l660 | evidence/03_symbols.md | 660-660 |
| ev.03_symbols_md.supabase_functions_recommend_products_index_ts.max_query_length.l661 | evidence/03_symbols.md | 661-661 |
| ev.03_symbols_md.supabase_functions_recommend_products_index_ts.max_candidates.l662 | evidence/03_symbols.md | 662-662 |
| ev.03_symbols_md.supabase_functions_recommend_products_index_ts.cors.l663 | evidence/03_symbols.md | 663-663 |
| ev.03_symbols_md.supabase_functions_recommend_products_index_ts.fallbackranking.l664 | evidence/03_symbols.md | 664-664 |
| ev.03_symbols_md.supabase_functions_recommend_products_index_ts.json.l665 | evidence/03_symbols.md | 665-665 |
| ev.04_symbols_json | evidence/04_symbols.json | 1-579 |
| ev.05_tests_md | evidence/05_tests.md | 1-11 |
| ev.05_tests_md.app_src_lib_ailimit_js | evidence/05_tests.md | 3-7 |
| ev.05_tests_md.supabase_functions_concierge_index_ts | evidence/05_tests.md | 8-11 |
| ev.07_entrypoints_md | evidence/07_entrypoints.md | 1-5 |
| ev.08_config_env_md | evidence/08_config_env.md | 1-18 |
| ev.08_config_env_md.scan_limitations | evidence/08_config_env.md | 14-18 |
| ev.09_diff_evidence_md | evidence/09_diff_evidence.md | 1-47 |
| ev.09_diff_evidence_md.working_tree | evidence/09_diff_evidence.md | 5-10 |
| ev.09_diff_evidence_md.staged_files | evidence/09_diff_evidence.md | 11-16 |
| ev.09_diff_evidence_md.unstaged_files | evidence/09_diff_evidence.md | 17-22 |
| ev.09_diff_evidence_md.last_commit_files | evidence/09_diff_evidence.md | 23-33 |
| ev.09_diff_evidence_md.since_scope | evidence/09_diff_evidence.md | 34-47 |
| ev.10_observed_change_signals_md | evidence/10_observed_change_signals.md | 1-33 |
| ev.10_observed_change_signals_md.notes | evidence/10_observed_change_signals.md | 30-33 |
| ev.10_observed_change_signals_json | evidence/10_observed_change_signals.json | 1-211 |
| ev.11_dependency_inventory_md | evidence/11_dependency_inventory.md | 1-82 |
| ev.11_dependency_inventory_md.guardrail | evidence/11_dependency_inventory.md | 80-82 |
| ev.11_dependency_inventory_json | evidence/11_dependency_inventory.json | 1-72 |
| ev.12_code_metrics_md | evidence/12_code_metrics.md | 1-52 |
| ev.12_code_metrics_md.guardrail | evidence/12_code_metrics.md | 50-52 |
| ev.12_code_metrics_json | evidence/12_code_metrics.json | 1-42 |
| ev.13_public_api_surface_md | evidence/13_public_api_surface.md | 1-53 |
| ev.13_public_api_surface_md.guardrail | evidence/13_public_api_surface.md | 51-53 |
| ev.13_public_api_surface_json | evidence/13_public_api_surface.json | 1-43 |
| ev.14_code_excerpts_md | evidence/14_code_excerpts.md | 1-340 |
| ev.14_code_excerpts_md.app_src_app_jsx_14_20__app | evidence/14_code_excerpts.md | 7-20 |
| ev.14_code_excerpts_md.app_src_components_checkoutsteps_jsx_1_6__checkoutsteps | evidence/14_code_excerpts.md | 21-33 |
| ev.14_code_excerpts_md.app_src_components_flyingcartitem_jsx_13_19__flyingcartitem | evidence/14_code_excerpts.md | 34-47 |
| ev.14_code_excerpts_md.app_src_components_footer_jsx_8_14__footer | evidence/14_code_excerpts.md | 48-61 |
| ev.14_code_excerpts_md.app_src_components_header_jsx_8_14__header | evidence/14_code_excerpts.md | 62-75 |
| ev.14_code_excerpts_md.app_src_components_transitionlink_jsx_1_7__transitionlink | evidence/14_code_excerpts.md | 76-89 |
| ev.14_code_excerpts_md.app_src_data_engineer_profile_js_163_169__buildsystemprompt | evidence/14_code_excerpts.md | 90-103 |
| ev.14_code_excerpts_md.app_src_lib_ailimit_js_1_4__ailimitexceedederror | evidence/14_code_excerpts.md | 104-114 |
| ev.14_code_excerpts_md.app_src_lib_ailimit_js_22_28__consumeailimit | evidence/14_code_excerpts.md | 115-128 |
| ev.14_code_excerpts_md.app_src_lib_ailimit_js_38_43__getaidailylimit | evidence/14_code_excerpts.md | 129-141 |
| ev.14_code_excerpts_md.app_src_lib_ailimit_js_33_39__getaiusagetoday | evidence/14_code_excerpts.md | 142-155 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_12_18__addtocart | evidence/14_code_excerpts.md | 156-169 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_49_55__clearcart | evidence/14_code_excerpts.md | 170-183 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_113_119__createordernumber | evidence/14_code_excerpts.md | 184-197 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_75_81__getaicontext | evidence/14_code_excerpts.md | 198-211 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_4_10__getcart | evidence/14_code_excerpts.md | 212-225 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_96_102__getcartevents | evidence/14_code_excerpts.md | 226-239 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_79_85__getconsultations | evidence/14_code_excerpts.md | 240-253 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_53_59__getorders | evidence/14_code_excerpts.md | 254-267 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_83_89__recordconsultation | evidence/14_code_excerpts.md | 268-281 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_43_49__removefromcart | evidence/14_code_excerpts.md | 282-295 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_63_69__saveaicontext | evidence/14_code_excerpts.md | 296-309 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_8_14__savecart | evidence/14_code_excerpts.md | 310-323 |
| ev.14_code_excerpts_md.app_src_lib_cart_js_57_63__saveorder | evidence/14_code_excerpts.md | 324-337 |
| ev.14_code_excerpts_md.guardrail | evidence/14_code_excerpts.md | 338-340 |
| ev.14_code_excerpts_json | evidence/14_code_excerpts.json | 1-26 |
| ev.15_decision_memory_md | evidence/15_decision_memory.md | 1-5 |
| ev.15_decision_memory_json | evidence/15_decision_memory.json | 1-3 |
| ev.domain_00_infra_resources_md | evidence/domain/00_infra_resources.md | 1-11 |
| ev.30_static_signal_hits_md | evidence/30_static_signal_hits.md | 1-22 |
| ev.30_static_signal_hits_md.guardrail | evidence/30_static_signal_hits.md | 20-22 |
| ev.98_redaction_report_md | evidence/98_redaction_report.md | 1-20 |
| ev.99_scan_limitations_md | evidence/99_scan_limitations.md | 1-18 |
| ev.99_scan_limitations_md.parser_limitations__infra_web | evidence/99_scan_limitations.md | 3-9 |
| ev.99_scan_limitations_md.search_limitations | evidence/99_scan_limitations.md | 10-14 |
| ev.99_scan_limitations_md.current_limits | evidence/99_scan_limitations.md | 15-18 |
| ev.grep_01_todos_md | evidence/grep/01_todos.md | 1-8 |
| ev.grep_02_job_lifecycle_md | evidence/grep/02_job_lifecycle.md | 1-44 |
| ev.grep_03_env_secret_md | evidence/grep/03_env_secret.md | 1-61 |
| ev.grep_04_high_risk_ops_md | evidence/grep/04_high_risk_ops.md | 1-25 |
| ev.grep_05_auth_permission_md | evidence/grep/05_auth_permission.md | 1-128 |
| ev.grep_06_infra_surface_md | evidence/grep/06_infra_surface.md | 1-17 |
| ev.grep_99_no_hits_md | evidence/grep/99_no_hits.md | 1-10 |
| ev.grep_99_no_hits_md.todos | evidence/grep/99_no_hits.md | 3-10 |
| ev.grep_00_queries_json | evidence/grep/00_queries.json | 1-8 |

## Evidence Inputs

### evidence/00_scan_manifest.md

```markdown
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
```

### evidence/03_symbols.md

```markdown
# Symbols

## app/index.html

- L16: id `root`

## app/src/App.css

- L1: selector `.counter`
- L20: selector `.hero`
- L23: selector `.base,`
- L24: selector `.framework,`
- L25: selector `.vite`
- L30: selector `.base`
- L36: selector `.framework,`
- L37: selector `.vite`
- L41: selector `.framework`
- L49: selector `.vite`
- L59: selector `#center`
- L73: selector `#next-steps`
- L86: selector `.icon`
- L98: selector `#docs`
- L107: selector `#next-steps`
- L114: selector `.logo`
- L133: selector `.button-icon`
- L156: selector `#spacer`
- L164: selector `.ticks`

## app/src/App.jsx

- L17: component `App`

## app/src/components/CheckoutSteps.jsx

- L1: component `STEPS`
- L3: component `CheckoutSteps`

## app/src/components/FlyingCartItem.jsx

- L5: component `GRADIENTS`
- L16: component `FlyingCartItem`
- L47: component `SIZE`
- L51: component `Bullet`

## app/src/components/Footer.jsx

- L3: component `LINKS`
- L11: component `Footer`

## app/src/components/Header.jsx

- L7: function `getCount`
- L11: component `Header`

## app/src/components/TransitionLink.jsx

- L4: component `TransitionLink`

## app/src/data/engineer-profile.js

- L166: function `buildSystemPrompt`

## app/src/index.css

- L2: custom-property `--bg`
- L3: custom-property `--surface`
- L4: custom-property `--surface-soft`
- L5: custom-property `--ink`
- L6: custom-property `--muted`
- L7: custom-property `--line`
- L8: custom-property `--brand`
- L9: custom-property `--brand-strong`
- L10: custom-property `--accent`
- L11: custom-property `--accent-soft`
- L12: custom-property `--shadow`
- L13: custom-property `--shadow-hover`
- L14: custom-property `--radius`
- L16: custom-property `--space-1`
- L17: custom-property `--space-2`
- L18: custom-property `--space-3`
- L19: custom-property `--space-4`
- L20: custom-property `--space-5`
- L21: custom-property `--space-6`
- L22: custom-property `--space-8`
- L23: custom-property `--leading-tight`
- L24: custom-property `--leading-normal`
- L25: custom-property `--leading-relaxed`
- L26: custom-property `--tap-min`
- L94: selector `#root`
- L128: selector `.site-header`
- L138: selector `.header-inner`
- L147: selector `.header-logo`
- L157: selector `.header-logo`
- L162: selector `.header-nav`
- L168: selector `.header-nav`
- L179: selector `.header-nav`
- L184: selector `.header-nav-cta`
- L188: selector `.cart-link`
- L196: selector `.cart-link`
- L201: selector `.cart-badge`
- L218: selector `.checkout-steps`
- L226: selector `.step`
- L236: selector `.step`
- L246: selector `.step-pending`
- L250: selector `.step-active`
- L254: selector `.step-done`
- L258: selector `.step-num`
- L270: selector `.step-done`
- L276: selector `.step-active`
- L284: selector `.site-page`
- L290: selector `.hero-section`
- L310: selector `.hero-section`
- L320: selector `.hero-copy`
- L325: selector `.hero-copy,`
- L326: selector `.page-heading`
- L330: selector `.hero-copy`
- L337: selector `.eyebrow`
- L375: selector `.lead`
- L383: selector `.concierge-form`
- L389: selector `.guided-entry`

[truncated for context pack]
```

### evidence/08_config_env.md

```markdown
# Config / Env Inventory

- VITE_SUPABASE_ANON_KEY
  found_in:
    - app/src/lib/supabase.js:L5
  value: redacted (name/参照のみ)
  requiredness: unknown
- VITE_SUPABASE_URL
  found_in:
    - app/src/lib/supabase.js:L4
  value: redacted (name/参照のみ)
  requiredness: unknown

## Scan Limitations

- required/optional は未確認。
- default 値は解析していない。
- secret 値は含めない。
```

### evidence/30_static_signal_hits.md

```markdown
# Static Signal Hits

This is a machine-generated signal inventory, not a decision.
Every row points back to grep evidence.

| query_id | hit_state | hits | evidence_ref | follow_up |
|---|---|---:|---|---|
| `todos` | `no_hit` | 0 | `file=evidence/grep/01_todos.md query_id=todos` | treat as no-hit, not absence |
| `job_lifecycle` | `matched` | 39 | `file=evidence/grep/02_job_lifecycle.md query_id=job_lifecycle` | review matching lines before deciding |
| `env_secret` | `matched` | 56 | `file= <REDACTED>
| `high_risk_ops` | `matched` | 20 | `file=evidence/grep/04_high_risk_ops.md query_id=high_risk_ops` | review matching lines before deciding |
| `auth_permission` | `matched` | 123 | `file=evidence/grep/05_auth_permission.md query_id=auth_permission` | review matching lines before deciding |
| `infra_surface` | `matched` | 12 | `file=evidence/grep/06_infra_surface.md query_id=infra_surface` | review matching lines before deciding |
| `change_signal:app/src/index.css` | `observed` | 7 | `file=evidence/10_observed_change_signals.md path=app/src/index.css` | inspect change history before editing |
| `change_signal:app/src/pages/Concierge.jsx` | `observed` | 5 | `file=evidence/10_observed_change_signals.md path=app/src/pages/Concierge.jsx` | inspect change history before editing |
| `change_signal:app/e2e/demo-flow.spec.js` | `observed` | 5 | `file=evidence/10_observed_change_signals.md path=app/e2e/demo-flow.spec.js` | inspect change history before editing |
| `change_signal:env/config.yaml` | `observed` | 5 | `file=evidence/10_observed_change_signals.md path=env/config.yaml` | inspect change history before editing |
| `change_signal:supabase/functions/concierge/index.ts` | `observed` | 4 | `file=evidence/10_observed_change_signals.md path=supabase/functions/concierge/index.ts` | inspect change history before editing |

## Guardrail

- Static signal entries are observations only. Decision Catalog claims still need explicit `evidence_ref` values.
```

### evidence/99_scan_limitations.md

```markdown
# Scan Limitations

## Parser Limitations (infra+web)

- シンボル抽出は行ベース heuristic であり AST ではない。
- Rust: macro / proc-macro 生成、複数行シグネチャ、conditional compilation は取りこぼす。
- Python: 動的生成 class/function、デコレータ経由の登録、import hook は静的には見えない。
- impl 内メソッドと自由関数の区別（Rust）は近似。

## Search Limitations

- grep は指定 query 語彙に依存する。no-hit は不存在の証明ではない。
- 同義語・ドメイン固有命名は取りこぼす可能性がある。

## Current Limits

- 検出したシンボルの責務は未判定（investigate / Decision Catalog で扱う）。
- env の required/optional、secret の取り扱いは未確認。
```

### evidence/evidence_index.jsonl

```markdown
{"evidence_id":"ev.00_scan_manifest_md","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"00_scan_manifest.md","line_start":1,"line_end":46,"sha256":"3a00e75551ff50d83a001d63a6865e4d45de805867124cf63325e99c8369b04c"}
{"evidence_id":"ev.00_evidence_freshness_md","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"00_evidence_freshness.md","line_start":1,"line_end":12,"sha256":"e8a400d4626f0a720c1fb378693a773c64c2ecbf0d7a7374f6e34c0fd723e092"}
{"evidence_id":"ev.01_file_tree_md","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"01_file_tree.md","line_start":1,"line_end":196,"sha256":"208795e79c62d793c8dbd148c931c1edaa612fad89b05d7672efbe6c53714386"}
{"evidence_id":"ev.02_files_json","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"02_files.json","line_start":1,"line_end":196,"sha256":"b336c1ef2f660102a323ffb4ccc1a660404488089965b4191dab8299bcd37090"}
{"evidence_id":"ev.03_symbols_md","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":1,"line_end":666,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_index_html","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":3,"line_end":6,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":7,"line_end":28,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":29,"line_end":32,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_checkoutsteps_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":33,"line_end":37,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_flyingcartitem_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":38,"line_end":44,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_footer_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":45,"line_end":49,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_header_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":50,"line_end":54,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_transitionlink_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":55,"line_end":58,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_data_engineer_profile_js","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":59,"line_end":62,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":63,"line_end":516,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_lib_ailimit_js","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":517,"line_end":524,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_lib_cart_js","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":525,"line_end":548,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_lib_giftlabels_js","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":549,"line_end":555,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_lib_motion_js","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":556,"line_end":559,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_lib_supabase_js","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":560,"line_end":565,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_lib_viewtransition_js","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":566,"line_end":569,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_about_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":570,"line_end":573,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_admindemo_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":574,"line_end":585,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_cart_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":586,"line_end":590,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_checkout_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":591,"line_end":596,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_complete_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":597,"line_end":601,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_concierge_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":602,"line_end":614,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_orders_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":615,"line_end":618,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_productdetail_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":619,"line_end":623,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_products_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":624,"line_end":627,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_pages_top_jsx","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":628,"line_end":632,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_vite_config_js","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":633,"line_end":636,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.supabase_functions_concierge_index_ts","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":637,"line_end":656,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.supabase_functions_recommend_products_index_ts","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":657,"line_end":666,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_index_html.root.l5","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":5,"line_end":5,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.counter.l9","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":9,"line_end":9,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.hero.l10","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":10,"line_end":10,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.base.l11","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":11,"line_end":11,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.framework.l12","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":12,"line_end":12,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.vite.l13","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":13,"line_end":13,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.base.l14","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":14,"line_end":14,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.framework.l15","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":15,"line_end":15,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.vite.l16","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":16,"line_end":16,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.framework.l17","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":17,"line_end":17,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.vite.l18","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":18,"line_end":18,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.center.l19","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":19,"line_end":19,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.next_steps.l20","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":20,"line_end":20,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.icon.l21","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":21,"line_end":21,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.docs.l22","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":22,"line_end":22,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.next_steps.l23","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":23,"line_end":23,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.logo.l24","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":24,"line_end":24,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.button_icon.l25","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":25,"line_end":25,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.spacer.l26","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":26,"line_end":26,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_css.ticks.l27","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":27,"line_end":27,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_app_jsx.app.l31","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":31,"line_end":31,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_checkoutsteps_jsx.steps.l35","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":35,"line_end":35,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_checkoutsteps_jsx.checkoutsteps.l36","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":36,"line_end":36,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_flyingcartitem_jsx.gradients.l40","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":40,"line_end":40,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_flyingcartitem_jsx.flyingcartitem.l41","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":41,"line_end":41,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_flyingcartitem_jsx.size.l42","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":42,"line_end":42,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_flyingcartitem_jsx.bullet.l43","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":43,"line_end":43,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_footer_jsx.links.l47","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":47,"line_end":47,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_footer_jsx.footer.l48","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":48,"line_end":48,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_header_jsx.getcount.l52","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":52,"line_end":52,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_header_jsx.header.l53","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":53,"line_end":53,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_components_transitionlink_jsx.transitionlink.l57","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":57,"line_end":57,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_data_engineer_profile_js.buildsystemprompt.l61","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":61,"line_end":61,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.bg.l65","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":65,"line_end":65,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.surface.l66","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":66,"line_end":66,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.surface_soft.l67","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":67,"line_end":67,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.ink.l68","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":68,"line_end":68,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.muted.l69","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":69,"line_end":69,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.line.l70","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":70,"line_end":70,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.brand.l71","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":71,"line_end":71,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.brand_strong.l72","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":72,"line_end":72,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.accent.l73","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":73,"line_end":73,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.accent_soft.l74","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":74,"line_end":74,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.shadow.l75","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":75,"line_end":75,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.shadow_hover.l76","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":76,"line_end":76,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.radius.l77","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":77,"line_end":77,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.space_1.l78","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":78,"line_end":78,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.space_2.l79","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":79,"line_end":79,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.space_3.l80","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":80,"line_end":80,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.space_4.l81","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":81,"line_end":81,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.space_5.l82","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":82,"line_end":82,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.space_6.l83","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":83,"line_end":83,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.space_8.l84","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":84,"line_end":84,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.leading_tight.l85","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":85,"line_end":85,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.leading_normal.l86","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":86,"line_end":86,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.leading_relaxed.l87","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":87,"line_end":87,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.tap_min.l88","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":88,"line_end":88,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.root.l89","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":89,"line_end":89,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.site_header.l90","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":90,"line_end":90,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.header_inner.l91","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":91,"line_end":91,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.header_logo.l92","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":92,"line_end":92,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.header_logo.l93","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":93,"line_end":93,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.header_nav.l94","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":94,"line_end":94,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.header_nav.l95","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":95,"line_end":95,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.header_nav.l96","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":96,"line_end":96,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.header_nav_cta.l97","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":97,"line_end":97,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.cart_link.l98","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":98,"line_end":98,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.cart_link.l99","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":99,"line_end":99,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.cart_badge.l100","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":100,"line_end":100,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.checkout_steps.l101","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":101,"line_end":101,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.step.l102","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":102,"line_end":102,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.step.l103","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":103,"line_end":103,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.step_pending.l104","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":104,"line_end":104,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.step_active.l105","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":105,"line_end":105,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.step_done.l106","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":106,"line_end":106,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.step_num.l107","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":107,"line_end":107,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.step_done.l108","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":108,"line_end":108,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.step_active.l109","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":109,"line_end":109,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.site_page.l110","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":110,"line_end":110,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.hero_section.l111","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":111,"line_end":111,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.hero_section.l112","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":112,"line_end":112,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.hero_copy.l113","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":113,"line_end":113,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.hero_copy.l114","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":114,"line_end":114,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.page_heading.l115","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":115,"line_end":115,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.hero_copy.l116","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":116,"line_end":116,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}
{"evidence_id":"ev.03_symbols_md.app_src_index_css.eyebrow.l117","scan_id":"20260705T050205Z_14eead9e900b","target_git_commit":"02fa8bbe35806554863d059cd0c4d81dd8703efd","artifact":"03_symbols.md","line_start":117,"line_end":117,"sha256":"9a64b8d4b4c70d2042ef0f45ecde4005570b12d6b5831c6b78d5706f47b4eaa1"}

[truncated for context pack]
```

### evidence/01_file_tree.md

```markdown
# File Tree

- .claude/README.md
- .claude/hooks/detect-safety-boundary.sh
- .claude/hooks/detect-scope-creep.sh
- .claude/hooks/detect-unverified-claim.sh
- .claude/rules/docs.md
- .claude/rules/security.md
- .claude/settings.json
- .claude/skills/assess-risk/SKILL.md
- .claude/skills/check-claims/SKILL.md
- .claude/skills/classify-task/SKILL.md
- .claude/skills/control-change/SKILL.md
- .claude/skills/create-task/SKILL.md
- .claude/skills/distill-memory/SKILL.md
- .claude/skills/distill-spec/SKILL.md
- .claude/skills/execute-task/SKILL.md
- .claude/skills/log-decision/SKILL.md
- .claude/skills/plan-refactor/SKILL.md
- .claude/skills/plan-skeleton/SKILL.md
- .claude/skills/reconcile-task/SKILL.md
- .claude/skills/review-project/SKILL.md
- .claude/skills/review-task/SKILL.md
- .claude/skills/scan-decisions/SKILL.md
- .claude/skills/verify-completion/SKILL.md
- .gitignore
- AGENTS.md
- CLAUDE.md
- Makefile
- README.md
- app/.env.local
- app/.env.local.example
- app/.gitignore
- app/.oxlintrc.json
- app/README.md
- app/e2e/demo-flow.spec.js
- app/e2e/products-ui.spec.js
- app/e2e/routes.spec.js
- app/index.html
- app/package-lock.json
- app/package.json
- app/playwright.config.js
- app/public/_redirects
- app/public/favicon.svg
- app/public/icons.svg
- app/src/App.css
- app/src/App.jsx
- app/src/assets/hero.png
- app/src/assets/react.svg
- app/src/assets/vite.svg
- app/src/components/CheckoutSteps.jsx
- app/src/components/FlyingCartItem.jsx
- app/src/components/Footer.jsx
- app/src/components/Header.jsx
- app/src/components/TransitionLink.jsx
- app/src/data/admin-demo-sample.js
- app/src/data/engineer-profile.js
- app/src/data/products.js
- app/src/index.css
- app/src/lib/aiLimit.js
- app/src/lib/cart.js
- app/src/lib/giftLabels.js
- app/src/lib/motion.js
- app/src/lib/supabase.js
- app/src/lib/viewTransition.js
- app/src/main.jsx
- app/src/pages/About.jsx
- app/src/pages/AdminDemo.jsx
- app/src/pages/Cart.jsx
- app/src/pages/Checkout.jsx
- app/src/pages/Complete.jsx
- app/src/pages/Concierge.jsx
- app/src/pages/Orders.jsx
- app/src/pages/ProductDetail.jsx
- app/src/pages/Products.jsx
- app/src/pages/Top.jsx
- app/test-results/.last-run.json
- app/vite.config.js
- data/images/products/bodycare-001.jpg
- data/images/products/bodycare-002.jpg
- data/images/products/bodycare-003.jpg
- data/images/products/bodycare-004.jpg
- data/images/products/bodycare-005.jpg
- data/images/products/bodycare-006.jpg
- data/images/products/gift-001.jpg
- data/images/products/gift-002.jpg
- data/images/products/gift-003.jpg
- data/images/products/gift-004.jpg
- data/images/products/gift-005.jpg
- data/images/products/gift-006.jpg
- data/images/products/haircare-001.jpg
- data/images/products/haircare-002.jpg
- data/images/products/haircare-003.jpg
- data/images/products/haircare-004.jpg
- data/images/products/haircare-005.jpg
- data/images/products/haircare-006.jpg
- data/images/products/mensgift-001.jpg
- data/images/products/mensgift-002.jpg
- data/images/products/mensgift-003.jpg
- data/images/products/mensgift-004.jpg
- data/images/products/mensgift-005.jpg
- data/images/products/mensgift-006.jpg
- data/images/products/relax-001.jpg
- data/images/products/relax-002.jpg
- data/images/products/relax-003.jpg
- data/images/products/relax-004.jpg
- data/images/products/relax-005.jpg
- data/images/products/relax-006.jpg
- data/images/products/skincare-001.jpg
- data/images/products/skincare-002.jpg
- data/images/products/skincare-003.jpg
- data/images/products/skincare-004.jpg
- data/images/products/skincare-005.jpg
- data/images/products/skincare-006.jpg
- data/images/shop/hero.jpg
- docs/00_index.md
- docs/01_requirements.md
- docs/02_architecture.md
- docs/03_domain_model.md
- docs/04_workflows.md

[truncated for context pack]
```

### evidence/98_redaction_report.md

```markdown
# Redaction Report

status: passed
redacted_count: 39

checked_keywords:
  - secret
  - token
  - password
  - api_key
  - apikey
  - key

scope:
  - env_secret grep の代入形 (`KEY = ...` / `KEY: <REDACTED>

notes:
  - name / 参照箇所は残し、value のみ `<redacted>` に置換している。
  - これは網羅的な secret スキャンではない（高エントロピー文字列検出は対象外）。
  - env 参照の呼び出し（env::var / os.environ）は value を持たないため redaction 対象外。
```

## Investigated Findings

```markdown
# Investigated Findings

generated_by: dcm investigate
source: non_llm_evidence_investigation
judgment_status: llm_enriched

## observed_signals

- Evidence Pack exists and has the required scan, symbol, config, risk, and scan-limitation files. evidence_ref: file=evidence/00_scan_manifest.md
- Symbol evidence exists for code navigation and candidate responsibility boundaries. evidence_ref: file=evidence/03_symbols.md
- Configuration and environment evidence exists for secret and runtime-risk review. evidence_ref: file=evidence/08_config_env.md
- Static signal evidence exists and must be investigated before draft. evidence_ref: file=evidence/30_static_signal_hits.md
- Scan limitation evidence exists and can inform descriptive current implications when judgment-relevant. evidence_ref: file=evidence/99_scan_limitations.md

## available_evidence_files

- `00_evidence_freshness.md`
- `00_scan_manifest.md`
- `01_file_tree.md`
- `02_files.json`
- `03_symbols.md`
- `04_symbols.json`
- `05_tests.md`
- `07_entrypoints.md`
- `08_config_env.md`
- `09_diff_evidence.md`
- `10_observed_change_signals.json`
- `10_observed_change_signals.md`
- `11_dependency_inventory.json`
- `11_dependency_inventory.md`
- `12_code_metrics.json`
- `12_code_metrics.md`
- `13_public_api_surface.json`
- `13_public_api_surface.md`
- `14_code_excerpts.json`
- `14_code_excerpts.md`
- `15_decision_memory.json`
- `15_decision_memory.md`
- `30_static_signal_hits.md`
- `98_redaction_report.md`
- `99_scan_limitations.md`

## llm_enrichment

## item_meaning_candidates

- `app/src/lib/supabase.js` functions (`recommendProducts`, `askConcierge`, `generateGiftMessage`): likely client-side wrappers for Supabase Edge Functions, using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (evidence: 08_config_env).
- `supabase/functions/concierge/index.ts`: serverless function for conversational AI concierge, using DeepSeek model with query length and candidate limits (evidence: 03_symbols lists DEEPSEEK_MODEL, MAX_QUERY_LENGTH, MAX_CANDIDATES, FALLBACK_GIFT_MESSAGE, FALLBACK_RESPONSE, CORS, and functions like `generateGiftMessage`, `rankRecommendations`, `normalizeCandidates`).
- `supabase/functions/recommend-products/index.ts`: serverless function for product recommendations, also using DeepSeek model and including a `fallbackRanking` function (evidence: 03_symbols lists DEEPSEEK_MODEL, MAX_QUERY_LENGTH, MAX_CANDIDATES, CORS, `fallbackRanking`).
- `app/src/lib/aiLimit.js`: implements daily AI usage limit, with class `AiLimitExceededError`, function `consumeAiLimit` (test), `getAiDailyLimit` (test) (evidence: 03_symbols).
- CSS custom properties in `app/src/index.css` (--bg, --surface, --ink, etc.): design tokens for theming and layout tokens (--space-1 through --space-8, --tap-min) (evidence: 03_symbols).
- Change signals on `app/src/index.css`, `app/src/pages/Concierge.jsx`, `app/e2e/demo-flow.spec.js`, `env/config.yaml`, `supabase/functions/concierge/index.ts`: indicate recent modifications to UI styling, concierge page, e2e tests, environment config, and backend function (evidence: 30_static_signal_hits).
- `app/src/pages/AdminDemo.jsx` functions (`rankConsultationTopics`, `rankProducts`, `detectProductGaps`, `countMatchingProducts`): likely admin analytics and product gap detection (evidence: 03_symbols).
- `app/src/lib/cart.js` functions and constants (CART_KEY, ORDERS_KEY, AI_CONTEXT_KEY, CONSULTATIONS_KEY, CART_EVENTS_KEY): local storage keys and operations for cart, orders, AI context, consultations, cart events (evidence: 03_symbols).
- `app/src/lib/viewTransition.js` function `startViewTransition`: provides a view transition utility (evidence: 03_symbols).
- `app/src/lib/giftLabels.js` functions (`getGiftLabels`, `getGiftFitProfile`, `getComparisonRows`, `formatPriceBand`): gift-related label and comparison logic (evidence: 03_symbols).
- Static signals: `job_lifecycle` (39 hits), `env_secret` (56 hits, path redacted), `high_risk_ops` (20 hits), `auth_permission` (123 hits), `infra_surface` (12 hits) – indicate potential presence of lifecycle hooks, secrets, high-risk operations, auth permissions, and infrastructure surface in the codebase (evidence: 30_static_signal_hits).

## role_notes

- CSS selectors in `app/src/index.css` (`.hero-section`, `.product-card`, `.cart-line`, `.checkout-layout`, etc.) define roles for layout and component styling: hero, product display, cart, checkout flow, admin panels, AI concierge UI (`.chat-panel`, `.ai-reason`, `.follow-up-panel`), order management, and responsive breakpoints (evidence: 03_symbols).
- React components in `app/src/pages/` (Top, Products, ProductDetail, Cart, Checkout, Complete, Concierge, Orders, AdminDemo, About) serve as page-level route components (evidence: 03_symbols).
- `app/src/components/` (Header, Footer, CheckoutSteps, FlyingCartItem, TransitionLink) provide reusable UI sections (evidence: 03_symbols).
- `app/src/lib/supabase.js` functions act as API client for Supabase edge functions (evidence: 08_config_env, 03_symbols).
- `app/src/lib/aiLimit.js` enforces daily AI usage limits, with `AiLimitExceededError` as error class (evidence: 03_symbols).
- `supabase/functions/concierge/index.ts` functions (`rankRecommendations`, `scoreSensitiveFit` (test), `normalizeGiftMessage`, `normalizeCandidates`) implement backend logic for AI concierge: ranking, scoring sensitivity, normalization (evidence: 03_symbols).
- `supabase/functions/recommend-products/index.ts` `fallbackRanking` provides fallback product ranking logic (evidence: 03_symbols).
- `app/src/lib/cart.js` functions manage persistent browser storage for cart and order data (evidence: 03_symbols).
- `app/src/lib/giftLabels.js` provides gift label and fit profile analysis (evidence: 03_symbols).
- `app/src/lib/motion.js` exports `EASE` for animation easing (evidence: 03_symbols).
- `app/src/lib/viewTransition.js` provides a function `startViewTransition` for smooth page transitions (evidence: 03_symbols).
- Test-related: functions `consumeAiLimit`, `getAiDailyLimit` in `app/src/lib/aiLimit.js` and `scoreSensitiveFit` in `supabase/functions/concierge/index.ts` are marked `(test)` indicating they are either test helpers or specifically tested (evidence: 03_symbols).

## current_implications

- The application integrates Supabase for backend and uses AI (DeepSeek model) for product recommendations and concierge service (evidence: 08_config_env, 03_symbols).
- AI features are rate-limited daily, with a defined limit (`AI_DAILY_LIMIT` in `app/vite.config.js`) and error handling (`AiLimitExceededError`) (evidence: 03_symbols).
- The app has a comprehensive CSS design system with custom properties and responsive media queries; recent changes to `app/src/index.css` (7 changes) suggest active styling adjustments (evidence: 30_static_signal_hits, 03_symbols).
- The concierge page (`app/src/pages/Concierge.jsx`) and backend function (`supabase/functions/concierge/index.ts`) show change activity (5 and 4 changes respectively), indicating ongoing development in AI interaction flow (evidence: 30_static_signal_hits).
- Environment configuration (`env/config.yaml`) has 5 changes, suggesting deployment or feature toggle modifications (evidence: 30_static_signal_hits).
- E2E tests (`app/e2e/demo-flow.spec.js`) show 5 changes, implying test adjustments alongside feature changes (evidence: 30_static_signal_hits).
- The presence of `(test)` annotations on certain functions indicates unit test coverage for AI limit and scoring functions (evidence: 03_symbols).
- The codebase contains 577 symbols across 194 files, with test count of 3 and entrypoint count of 3, suggesting a moderately sized single-page application with limited formal tests (evidence: 00_scan_manifest).
- Scan limitations note that symbol extraction is heuristic, so some dynamic symbols may be missing; this affects completeness of analysis (evidence: 99_scan_limitations).

## uncertainty_notes

- Required/optional status of environment variables `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_URL` is unknown (evidence: 08_config_env).
- Default values for environment variables are not analyzed (evidence: 08_config_env).
- Static signal hits indicate potential security risks: `env_secret` (56 hits, path redacted), `high_risk_ops` (20 hits), `auth_permission` (123 hits) – but without reviewing the matching lines, the actual risk level is uncertain (evidence: 30_static_signal_hits).
- `job_lifecycle` hit (39 hits) may indicate lifecycle hooks or background jobs, but details are not available in provided evidence (evidence: 30_static_signal_hits).
- `infra_surface` hit (12 hits) may indicate deployment configuration, but content is unknown (evidence: 30_static_signal_hits).
- Change signals show number of changes but not the nature or purpose of those changes; follow-up with change history is recommended (evidence: 30_static_signal_hits).
- The `grep no-hit` for `todos` is not proof that no TODOs exist (evidence: 30_static_signal_hits guardrail).
- Symbol extraction is heuristic; dynamic/macro-generated symbols may be missing, especially in Rust macros or dynamic JSX props (evidence: 99_scan_limits).
- Test coverage is limited to 3 test files and specific functions marked `(test)`; overall test coverage is unclear (evidence: 00_scan_manifest, 03_symbols).
- Actual implementation logic for AI functions (e.g., `recommendProducts`, `askConcierge`) is not visible; only function signatures are captured (evidence: 03_symbols).

## judgment_value_added

- Raw inventory has been classified into draft inputs: observed signals, roles, and current implications.
- LLM enrichment, when present, adds meaning for each evidence item without changing observed evidence.
- This file does not approve an implementation choice or prescribe future work. It prevents raw scan output from being treated as a completed Decision Catalog.

## draft_inputs

- Draft must create `catalog_items` where each item pairs fact and meaning.
- Draft must not include advice, recommendations, next actions, validation plans, rollback plans, or change boundaries.
- Draft must cite evidence_ids for fact items and must not invent facts outside the Evidence Pack.

## required_llm_enrichment

- Assign role/current implication to evidence items.
- Keep risk language descriptive and current-state only.
- Put judgment-relevant uncertainty in descriptive current implications instead of a separate field.

## next_step

- Run `dcm draft <TARGET>` or `dcm llm draft <TARGET>` only after this investigated findings file exists.
```


---

# Investigated Findings

# Investigated Findings

generated_by: dcm investigate
source: non_llm_evidence_investigation
judgment_status: llm_enriched

## observed_signals

- Evidence Pack exists and has the required scan, symbol, config, risk, and scan-limitation files. evidence_ref: file=evidence/00_scan_manifest.md
- Symbol evidence exists for code navigation and candidate responsibility boundaries. evidence_ref: file=evidence/03_symbols.md
- Configuration and environment evidence exists for secret and runtime-risk review. evidence_ref: file=evidence/08_config_env.md
- Static signal evidence exists and must be investigated before draft. evidence_ref: file=evidence/30_static_signal_hits.md
- Scan limitation evidence exists and can inform descriptive current implications when judgment-relevant. evidence_ref: file=evidence/99_scan_limitations.md

## available_evidence_files

- `00_evidence_freshness.md`
- `00_scan_manifest.md`
- `01_file_tree.md`
- `02_files.json`
- `03_symbols.md`
- `04_symbols.json`
- `05_tests.md`
- `07_entrypoints.md`
- `08_config_env.md`
- `09_diff_evidence.md`
- `10_observed_change_signals.json`
- `10_observed_change_signals.md`
- `11_dependency_inventory.json`
- `11_dependency_inventory.md`
- `12_code_metrics.json`
- `12_code_metrics.md`
- `13_public_api_surface.json`
- `13_public_api_surface.md`
- `14_code_excerpts.json`
- `14_code_excerpts.md`
- `15_decision_memory.json`
- `15_decision_memory.md`
- `30_static_signal_hits.md`
- `98_redaction_report.md`
- `99_scan_limitations.md`

## llm_enrichment

## item_meaning_candidates

- `app/src/lib/supabase.js` functions (`recommendProducts`, `askConcierge`, `generateGiftMessage`): likely client-side wrappers for Supabase Edge Functions, using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (evidence: 08_config_env).
- `supabase/functions/concierge/index.ts`: serverless function for conversational AI concierge, using DeepSeek model with query length and candidate limits (evidence: 03_symbols lists DEEPSEEK_MODEL, MAX_QUERY_LENGTH, MAX_CANDIDATES, FALLBACK_GIFT_MESSAGE, FALLBACK_RESPONSE, CORS, and functions like `generateGiftMessage`, `rankRecommendations`, `normalizeCandidates`).
- `supabase/functions/recommend-products/index.ts`: serverless function for product recommendations, also using DeepSeek model and including a `fallbackRanking` function (evidence: 03_symbols lists DEEPSEEK_MODEL, MAX_QUERY_LENGTH, MAX_CANDIDATES, CORS, `fallbackRanking`).
- `app/src/lib/aiLimit.js`: implements daily AI usage limit, with class `AiLimitExceededError`, function `consumeAiLimit` (test), `getAiDailyLimit` (test) (evidence: 03_symbols).
- CSS custom properties in `app/src/index.css` (--bg, --surface, --ink, etc.): design tokens for theming and layout tokens (--space-1 through --space-8, --tap-min) (evidence: 03_symbols).
- Change signals on `app/src/index.css`, `app/src/pages/Concierge.jsx`, `app/e2e/demo-flow.spec.js`, `env/config.yaml`, `supabase/functions/concierge/index.ts`: indicate recent modifications to UI styling, concierge page, e2e tests, environment config, and backend function (evidence: 30_static_signal_hits).
- `app/src/pages/AdminDemo.jsx` functions (`rankConsultationTopics`, `rankProducts`, `detectProductGaps`, `countMatchingProducts`): likely admin analytics and product gap detection (evidence: 03_symbols).
- `app/src/lib/cart.js` functions and constants (CART_KEY, ORDERS_KEY, AI_CONTEXT_KEY, CONSULTATIONS_KEY, CART_EVENTS_KEY): local storage keys and operations for cart, orders, AI context, consultations, cart events (evidence: 03_symbols).
- `app/src/lib/viewTransition.js` function `startViewTransition`: provides a view transition utility (evidence: 03_symbols).
- `app/src/lib/giftLabels.js` functions (`getGiftLabels`, `getGiftFitProfile`, `getComparisonRows`, `formatPriceBand`): gift-related label and comparison logic (evidence: 03_symbols).
- Static signals: `job_lifecycle` (39 hits), `env_secret` (56 hits, path redacted), `high_risk_ops` (20 hits), `auth_permission` (123 hits), `infra_surface` (12 hits) – indicate potential presence of lifecycle hooks, secrets, high-risk operations, auth permissions, and infrastructure surface in the codebase (evidence: 30_static_signal_hits).

## role_notes

- CSS selectors in `app/src/index.css` (`.hero-section`, `.product-card`, `.cart-line`, `.checkout-layout`, etc.) define roles for layout and component styling: hero, product display, cart, checkout flow, admin panels, AI concierge UI (`.chat-panel`, `.ai-reason`, `.follow-up-panel`), order management, and responsive breakpoints (evidence: 03_symbols).
- React components in `app/src/pages/` (Top, Products, ProductDetail, Cart, Checkout, Complete, Concierge, Orders, AdminDemo, About) serve as page-level route components (evidence: 03_symbols).
- `app/src/components/` (Header, Footer, CheckoutSteps, FlyingCartItem, TransitionLink) provide reusable UI sections (evidence: 03_symbols).
- `app/src/lib/supabase.js` functions act as API client for Supabase edge functions (evidence: 08_config_env, 03_symbols).
- `app/src/lib/aiLimit.js` enforces daily AI usage limits, with `AiLimitExceededError` as error class (evidence: 03_symbols).
- `supabase/functions/concierge/index.ts` functions (`rankRecommendations`, `scoreSensitiveFit` (test), `normalizeGiftMessage`, `normalizeCandidates`) implement backend logic for AI concierge: ranking, scoring sensitivity, normalization (evidence: 03_symbols).
- `supabase/functions/recommend-products/index.ts` `fallbackRanking` provides fallback product ranking logic (evidence: 03_symbols).
- `app/src/lib/cart.js` functions manage persistent browser storage for cart and order data (evidence: 03_symbols).
- `app/src/lib/giftLabels.js` provides gift label and fit profile analysis (evidence: 03_symbols).
- `app/src/lib/motion.js` exports `EASE` for animation easing (evidence: 03_symbols).
- `app/src/lib/viewTransition.js` provides a function `startViewTransition` for smooth page transitions (evidence: 03_symbols).
- Test-related: functions `consumeAiLimit`, `getAiDailyLimit` in `app/src/lib/aiLimit.js` and `scoreSensitiveFit` in `supabase/functions/concierge/index.ts` are marked `(test)` indicating they are either test helpers or specifically tested (evidence: 03_symbols).

## current_implications

- The application integrates Supabase for backend and uses AI (DeepSeek model) for product recommendations and concierge service (evidence: 08_config_env, 03_symbols).
- AI features are rate-limited daily, with a defined limit (`AI_DAILY_LIMIT` in `app/vite.config.js`) and error handling (`AiLimitExceededError`) (evidence: 03_symbols).
- The app has a comprehensive CSS design system with custom properties and responsive media queries; recent changes to `app/src/index.css` (7 changes) suggest active styling adjustments (evidence: 30_static_signal_hits, 03_symbols).
- The concierge page (`app/src/pages/Concierge.jsx`) and backend function (`supabase/functions/concierge/index.ts`) show change activity (5 and 4 changes respectively), indicating ongoing development in AI interaction flow (evidence: 30_static_signal_hits).
- Environment configuration (`env/config.yaml`) has 5 changes, suggesting deployment or feature toggle modifications (evidence: 30_static_signal_hits).
- E2E tests (`app/e2e/demo-flow.spec.js`) show 5 changes, implying test adjustments alongside feature changes (evidence: 30_static_signal_hits).
- The presence of `(test)` annotations on certain functions indicates unit test coverage for AI limit and scoring functions (evidence: 03_symbols).
- The codebase contains 577 symbols across 194 files, with test count of 3 and entrypoint count of 3, suggesting a moderately sized single-page application with limited formal tests (evidence: 00_scan_manifest).
- Scan limitations note that symbol extraction is heuristic, so some dynamic symbols may be missing; this affects completeness of analysis (evidence: 99_scan_limitations).

## uncertainty_notes

- Required/optional status of environment variables `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_URL` is unknown (evidence: 08_config_env).
- Default values for environment variables are not analyzed (evidence: 08_config_env).
- Static signal hits indicate potential security risks: `env_secret` (56 hits, path redacted), `high_risk_ops` (20 hits), `auth_permission` (123 hits) – but without reviewing the matching lines, the actual risk level is uncertain (evidence: 30_static_signal_hits).
- `job_lifecycle` hit (39 hits) may indicate lifecycle hooks or background jobs, but details are not available in provided evidence (evidence: 30_static_signal_hits).
- `infra_surface` hit (12 hits) may indicate deployment configuration, but content is unknown (evidence: 30_static_signal_hits).
- Change signals show number of changes but not the nature or purpose of those changes; follow-up with change history is recommended (evidence: 30_static_signal_hits).
- The `grep no-hit` for `todos` is not proof that no TODOs exist (evidence: 30_static_signal_hits guardrail).
- Symbol extraction is heuristic; dynamic/macro-generated symbols may be missing, especially in Rust macros or dynamic JSX props (evidence: 99_scan_limits).
- Test coverage is limited to 3 test files and specific functions marked `(test)`; overall test coverage is unclear (evidence: 00_scan_manifest, 03_symbols).
- Actual implementation logic for AI functions (e.g., `recommendProducts`, `askConcierge`) is not visible; only function signatures are captured (evidence: 03_symbols).

## judgment_value_added

- Raw inventory has been classified into draft inputs: observed signals, roles, and current implications.
- LLM enrichment, when present, adds meaning for each evidence item without changing observed evidence.
- This file does not approve an implementation choice or prescribe future work. It prevents raw scan output from being treated as a completed Decision Catalog.

## draft_inputs

- Draft must create `catalog_items` where each item pairs fact and meaning.
- Draft must not include advice, recommendations, next actions, validation plans, rollback plans, or change boundaries.
- Draft must cite evidence_ids for fact items and must not invent facts outside the Evidence Pack.

## required_llm_enrichment

- Assign role/current implication to evidence items.
- Keep risk language descriptive and current-state only.
- Put judgment-relevant uncertainty in descriptive current implications instead of a separate field.

## next_step

- Run `dcm draft <TARGET>` or `dcm llm draft <TARGET>` only after this investigated findings file exists.


---

# Create Decision Catalog Prompt

`00_llm_context_pack.md` の Evidence と Investigated Findings に基づき、Decision Catalog の判断を
**JSON schema に厳密準拠した JSON で** 返す（response_format で強制される）。markdown は書かない。

出力構造:
- `catalog_items`: 上位モデルが読む本体。repo object のみを書く。許可 subject は file / module / symbol / entrypoint / env / dependency / test_surface。
- `flow_items`: 観測される主要フロー候補を書く。product Golden Path 判定ではなく、entrypoint / command surface / touched symbols で弱接地した記述的な動線素材。`catalog_items` は部品、`flow_items` は部品間の方向・順序・候補導線、`evidence_appendix` は scan 足場。
- `scan_summary`: count-only signal、no-hit 注記、scan manifest / metrics / file tree など、意味付け対象ではないが捨ててはいけない scan 概要を書く。
- `evidence_appendix`: parser limitation、generic public API listing、generic change_signal、infra no-hit など、本体 item にしない補助 evidence を書く。

言語ルール:
- prose フィールド（fact.detail / meaning.role / meaning.current_implication）は**日本語**で書く。
- schema のキーと enum 値（confidence, fact.type, observed_by）は英語のまま。

参照ルール（最重要）:
- catalog_items の各項目は `evidence_ids` に、Evidence Index の `evidence_id` 値だけを入れる（例: `ev.03_symbols_md`）。
- `evidence_ids` は必ず `ev.` で始まる値だけ。`item.*` / `src.*` / `path.*` のような repo-object ID を入れない。
- 単数形 `evidence_id` は schema に存在しない。必ず配列 `evidence_ids` だけを使う。
- **file / line / scan_id / sha256 は書かない**。`evidence_ids` も machine join key なので Markdown 本体へ出ない。完全な machine provenance は `evidence_index.jsonl` sidecar に隔離する。
- 存在しない evidence_id を作らない。unknown id は reject される。
- catalog_items の全項目に最低 1 つの evidence_id を付ける。

- flow_items のルール:
- `subject_kind` は必ず `evidence_inferred_flow`。
- `flow_type` は `primary_candidate` / `destructive` / `destructive_surface_candidate` / `decoy_signal` / `config` / `error` / `unknown`。`grounding_level` と step `confidence` は `strong` / `medium` / `weak`。
- `label` は `primary_task_lifecycle_candidate` / `destructive_management_candidate` / `clear_all_surface_candidate` のように観測候補として書く。`Golden Path` / `Critical User Journey` を fact 化しない。
- primary と destructive を混ぜない。primary_candidate に remove/delete/clear の step や basis を入れない。clear は remove と別 flow item にし、`flow_type: destructive_surface_candidate` を使う。CLI 露出が evidence で不明なら `surface: candidate clear operation` として弱く書き、露出ギャップを `cannot_conclude` に残す。
- 各 flow は `basis` を持つ。例: `src/cli.rs::Command`, `src/store.rs::Store::{add,tasks,set_status,remove}`, `src/model.rs::{Task,Status}`。
- 各 step は `user_intent`, `surface`, `components`, `data_effect`, `confidence`, `evidence_ids` を持つ。`components` は repo object、`basis` は根拠シンボル。本文に evidence refs や evidence_ids は出ない。
- `surface` に `task add` のような実サブコマンド名を書けるのは、Command variant / CLI parse evidence で確認できた場合だけ。未確認なら `candidate add operation` / `candidate list operation` / `candidate status update operation` と書く。
- call graph が無い場合は `grounding_level: weak` とし、`cannot_conclude` に「product 上の主要行動かは断定しない」「dispatch 順序は call graph 未導入では弱接地」「CLI サブコマンド実名は未確認」のような接地ギャップを残す。
- flow は処方ではない。守るべき、改善すべき、確認ダイアログを足すべき、`next_action` などを書かない。

- fact は target の事実だけを書く。Evidence Pack や `evidence/` のファイルが存在する、というメタ事実を書かない。

内容ルール:
- catalog_items の fact.path は `/` / 空 / `src/` / evidence artifact 名にしない。`src/cli.rs`, `src/store.rs`, `src/model.rs::Task`, `src/model.rs::Status`, `src/main.rs`, `TASKCLI_DB` のように repo object をキーにする。
- Rust CLI で該当 evidence がある場合、最低限 `src/cli.rs`, `src/store.rs`, `src/model.rs::Task`, `src/model.rs::Status`, `src/main.rs`, `TASKCLI_DB`, `Cargo.toml`, `test_surface` を本体 `catalog_items` に置く。
- `grep` / `change_signal` / `symbols` は catalog_items の fact.type にしない。grep hit は該当 file/symbol item の evidence として吸収する。count のみなら scan_summary へ置く。
- `03_symbols.md 全体`, `30_static_signal_hits.md 全体`, `99_scan_limitations.md 全体` の説明を書かない。それらは repo object を照らす evidence であって subject ではない。
- catalog_items は fact と meaning の対で書く。fact には観測事実だけを書き、推論やリスク含意は meaning.current_implication に置く。
- meaning.role はその項目/ファイルが現在システム内で何であるかを書く。
- meaning.current_implication は現在の含意だけを書く。risk signal は記述的に書いてよいが、何をすべきかは書かない。
- meaning は evidence file を開かずに読める repo 固有の内容にする。「詳細は当該 evidence/インベントリファイルを参照」は禁止。
- `確認が必要` / `確認する必要がある` / `調査が必要` のような次行動要求を書かない。判断に効く未確定の含意は `current_implication` に記述的に書き、判断や追加調査は消費側に残す。
- この禁止は `scan_summary` / `evidence_appendix` にも適用する。appendix も「証拠へのリンク集」ではなく、自己完結した短い要約にする。
- 「TODO は未完了作業を示す」「変更シグナルは最近変更された可能性を示す」「grep hit は静的シグナルである」だけの辞書説明は禁止。
- `domain` は scan profile のコピーではなく、実コード・entrypoint・domain evidence から推定する。YAML/JSON/config があるだけで `infra` にしない。
- `domain: infra` は `domain/00_infra_resources.md` に具体的な infra resource/job/image/env reference がある場合に限定する。`status: no infra domain evidence detected` なら CLI / library / web など主対象の domain を選ぶ。
- `next_action` / `recommended_decision` / `decision_options` / `validation_plan` / `rollback_condition` / `failure_conditions` / `allowed_files` / `max_files_changed` は絶対に書かない。
- grep no-hit を「存在しない」「not found」「absent」と断定しない。低リスク判断でも「検出されていない」ではなく「cited evidence の範囲では小さい/限定的」と書く。
- no-hit に触れる必要がある場合は、必ず「不存在の証明ではない / not proof of absence」と同じ文の中で明記する。
- secret 値を出さない。

Return JSON only. Do not include markdown or review_status.