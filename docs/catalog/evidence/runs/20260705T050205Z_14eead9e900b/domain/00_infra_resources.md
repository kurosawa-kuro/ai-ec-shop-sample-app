# Infra Domain Evidence

evidence_id: ev.domain.infra

scope: Terraform / GitHub Actions / Dockerfile static definitions.

guardrail:
- IaC 定義は本番に存在する証明ではない。ここでは `found_in` の観測事実だけを出す。
- secret 値は出さず、参照名と場所だけを出す。

status: no infra domain evidence detected
