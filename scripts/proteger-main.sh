#!/usr/bin/env bash
# Protège main : PR obligatoire, 1 approbation, CI verte. À lancer par le propriétaire du repo (valdis7).
set -euo pipefail
REPO="valdis7/Atelier_Scrum"
gh api -X PUT "repos/$REPO/branches/main/protection" --input - <<'EOF'
{
  "required_status_checks": { "strict": true, "contexts": ["API (lint + tests)", "Front (lint + build)"] },
  "enforce_admins": true,
  "required_pull_request_reviews": { "required_approving_review_count": 1 },
  "restrictions": null
}
EOF
echo "main est protégée."
