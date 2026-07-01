.PHONY: setup build run dev test debug fmt lint clean fn-deploy fn-logs

# Application
APP_NAME := lumiere-select
SRC_DIR  := app

# 初期セットアップ (依存取得・ビルド)
setup: deps build
	@echo "Setup complete."

deps:
	cd $(SRC_DIR) && npm install

# ビルド
build:
	cd $(SRC_DIR) && npm run build

# Cloudflare Pages デプロイ (CLOUDFLARE_API_TOKEN 環境変数が必要)
deploy:
	cd $(SRC_DIR) && wrangler pages deploy dist --project-name lumiere-select --commit-dirty=true

# 実行 (ビルド済み成果物をプレビュー)
run:
	cd $(SRC_DIR) && npm run preview

# 開発 (ホットリロード)
dev:
	cd $(SRC_DIR) && npm run dev

# テスト (今回は省略)
test:
	@echo "No automated tests configured."

# Playwright デバッグ (ブラウザを開いて目視確認)
debug:
	cd $(SRC_DIR) && npx playwright test --headed

# Playwright UI モード (インタラクティブデバッグ)
debug-ui:
	cd $(SRC_DIR) && npx playwright test --ui

# 整形
fmt:
	cd $(SRC_DIR) && npx prettier --write "src/**/*.{js,jsx}"

# 静的解析
lint:
	cd $(SRC_DIR) && npm run lint

# Edge Functions デプロイ (supabase login 済みであること)
fn-deploy:
	supabase functions deploy recommend-products
	supabase functions deploy concierge

# Edge Functions ログ確認
fn-logs:
	supabase functions logs recommend-products --tail
	supabase functions logs concierge --tail

# クリーンアップ
clean:
	rm -rf $(SRC_DIR)/dist $(SRC_DIR)/node_modules
