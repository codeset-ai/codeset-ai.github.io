Here's what your agent sees when it opens payments.ts — with Codeset:

Pitfalls:
  ✗ Don't call charge() inside a DB transaction
  → Stripe call may succeed but rollback fires

  ✗ Never log the full PaymentIntent object
  → Contains raw card data (PCI violation)

Without Codeset, your agent has no idea these cliffs exist.

These aren't hypothetical. They're extracted from your actual git history — real bugs, real fixes, real consequences.

Use code **CODESETLAUNCH** for a free repo analysis.

🔗 [link in comments]
