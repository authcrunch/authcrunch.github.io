# Token Roles Removal

Historical workstation-specific scenario. Its Caddyfile filters roles with
whitespace and roles outside selected portal names, then allows portal admins
into the example app. It includes public demo passwords and an obsolete
`/settings` link; it is not a current deployment recipe.

Use the current [role-dropping guidance](../../../docs/authenticate/42-user-transforms.md#drop-matched-roles).
Role-dropping matchers evaluate each role alone; adding another identity matcher
can prevent removal. Keep portal roles separate from app membership and test
an intended member and a signed-in nonmember. See the
[solution status](../README.md) before using the original files.
