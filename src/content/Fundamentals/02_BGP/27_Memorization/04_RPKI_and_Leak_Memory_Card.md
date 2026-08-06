# RPKI and Route-Leak Memory Card

RPKI origin states:

- **Valid:** covering VRP, origin matches, length allowed.
- **Invalid:** covering VRP, origin or length fails.
- **NotFound:** no covering VRP.

ROV validates origin authorization, not the entire AS path.

Leak memory rule:

- Customer routes may commonly go up, sideways, and down.
- Peer/provider routes should normally go only down to customers.

BGP Roles and OTC help signal this relationship constraint. Prefix/export policy remains essential.

---

