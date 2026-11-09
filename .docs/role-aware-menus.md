# Role-aware App menu matrix

This is the starter matrix currently implemented by the API and staff App. It describes navigation and client-side route behavior, not authorization for future business data.

## Role sources

Churchbase keeps platform roles separate from church and ministry membership roles:

| Role source         | Roles                      | Controls                                                                                                                     |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Platform user       | `admin`, `staff`           | Identity's platform/App workspace chooser and platform operations; does not grant Church-wide or ministry access in the App. |
| Church membership   | `admin`, `staff`, `member` | Church-wide App context and its capabilities.                                                                                |
| Ministry membership | `lead`, `member`           | The context and capabilities for that ministry, provided the associated church and ministry memberships are active.          |

`GET /api/v1/users/me/access-contexts` returns active, same-church membership contexts and the API-computed navigation capabilities below. A user's `platform_role` is not used to derive App contexts. If someone has a platform role and a church or ministry membership, their App menus are based on the membership role. A platform-only user receives no App contexts.

## Current menu matrix

| App context                        | Membership role | Menu entries shown                                                                                | Not shown                                      |
| ---------------------------------- | --------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Church-wide                        | Admin           | Overview, People, Ministries                                                                      | Care                                           |
| Church-wide                        | Staff           | Overview, People                                                                                  | Ministries, Care                               |
| Church-wide                        | Member          | No Church-wide context or main menu. Any separate ministry membership is evaluated independently. | Church-wide Overview, People, Ministries, Care |
| Broadcast                          | Lead            | Overview, Services, Media, Team                                                                   | —                                              |
| Broadcast                          | Member          | Overview, Services, Media                                                                         | Team                                           |
| Music                              | Lead            | Overview, Songs & Setlists, Rehearsals, Team                                                      | —                                              |
| Music                              | Member          | Overview, Songs & Setlists, Rehearsals                                                            | Team                                           |
| Kids                               | Lead or Member  | Overview, Classes                                                                                 | Check-in, Volunteers & Safety                  |
| Other ministry or unsupported role | Any             | No context menu                                                                                   | All ministry entries                           |

The footer's Settings link and sidebar-collapse action are available regardless of context. Settings is also allowed by the App route gate without a membership context. Other configured routes require a context whose capability includes that page.

## Platform-admin/staff access to App pages

**Platform `admin`/`staff` are not currently included as roles that grant access to Church-wide or ministry pages.** Identity may show them the workspace chooser, but selecting App does not confer an App context. Without an active church or ministry membership, the App shows no workspace access on its configured work pages; Settings remains available. Assigning an active membership gives access according to that membership's role—not the platform role.

The App's `WorkspaceAccessGate` filters navigation and checks configured routes against the selected context's capabilities. This is a client-side presentation guard, not a server-side security boundary. Current ministry pages are placeholders and there are no ministry business-data endpoints yet. Before adding real data, every API operation must independently validate the session, active membership, church/ministry scope, and required capability. The URL's `context_id` and the returned menu capabilities are not authorization tokens.

## Capabilities still withheld

No persisted explicit-grant mechanism exists yet. Accordingly, the API does not currently return these capabilities to any role:

- `care.read`
- `kids.check-in.read`
- `kids.safety.read` (Volunteers & Safety)
- `church.ministries.read` for Church-wide Staff

Add and authorize explicit grants before exposing these entries; do not infer them from platform roles or ministry-lead status.
