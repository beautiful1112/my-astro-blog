# Regulatory and AI security

Compliance is a **constraint as given** (PCI, HIPAA, GDPR, etc.). Design evidence: segmentation, logging location, crypto, admin AAA, change control.

AI-specific (v3.1): prompts and datasets may leak **IP, PII, proprietary data**; external models affect **credibility and quality**; use of external AI is a governance control (allow-list, DLP, private models).

Network jobs: egress control, inspection where lawful, regional pinning, logging that is itself compliant.

## Interview framing

“Regulation tells me where data may live and what I must log. AI is a new egress class: I treat model APIs like untrusted partners unless the constraint says otherwise.”

---
