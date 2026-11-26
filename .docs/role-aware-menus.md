# Role-aware App menu matrix

This documents API-computed navigation and the App's client-side route gate; it is not authorization for business data.

## Role sources and access

Churchbase keeps global roles separate from church and ministry membership roles:

| Role source         | Roles                      | Access                                                                                                                                                                                  |
| ------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Global role         | `admin`, `staff`           | Identity workspace chooser and every configured App section across all churches and ministries, without membership requirements. Global Admin alone may review workspace-entry history. |
| Church membership   | `admin`, `staff`, `member` | Church-wide App context and membership-derived capabilities.                                                                                                                            |
| Ministry membership | `lead`, `member`           | That ministry's context and capabilities when its associated church and ministry memberships are active.                                                                                |

`GET /api/v1/users/me/access-contexts` returns `global_roles` and active membership contexts with API-computed navigation capabilities. For a global-role user it also lists all non-deleted church and ministry contexts, regardless of membership, and marks them `global_admin` or `global_staff`. Global-role access does not depend on having any context rows; it applies across the deployment. Identity routes both global roles through `/workspace`; regular users go to their validated App return URL.

## Current membership menu matrix

| App context                        | Membership role              | Menu entries shown                                                                                | Not shown                                      |
| ---------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Church-wide                        | Admin                        | Overview, People, Ministries                                                                      | Care                                           |
| Church-wide                        | Staff                        | Overview, People                                                                                  | Ministries, Care                               |
| Church-wide                        | Member                       | No Church-wide context or main menu. Any separate ministry membership is evaluated independently. | Church-wide Overview, People, Ministries, Care |
| Broadcast                          | Lead                         | Overview, Services, Media, Team                                                                   | —                                              |
| Broadcast                          | Member                       | Overview, Services, Media                                                                         | Team                                           |
| Music                              | Lead                         | Overview, Songs & Setlists, Rehearsals, Team                                                      | —                                              |
| Music                              | Member                       | Overview, Songs & Setlists, Rehearsals                                                            | Team                                           |
| Kids                               | Lead or Member               | Overview, Classes                                                                                 | Check-in, Volunteers & Safety                  |
| Other ministry or unsupported role | Any                          | No context menu                                                                                   | All ministry entries                           |
| Any configured App section         | Global Admin or Global Staff | All currently configured App entries                                                              | —                                              |

The footer's Settings link and sidebar-collapse action are available regardless of context. Settings is also allowed by the App route gate without a membership context. Global roles pass the client-side gate for all currently configured work routes. The Platform workspace card is still unavailable; no other Churchbase app workspace is implemented here.

## Authorization and limitations

The App's `WorkspaceAccessGate` filters navigation and checks configured routes against API-returned capabilities or the API-owned global role. This is a client-side presentation guard, not a server-side security boundary. Current ministry pages are placeholders and there are no ministry business-data endpoints yet. Before adding real data, every API operation must independently validate the session and enforce the corresponding global-role or membership authorization; `context_id` and menu capabilities are not authorization tokens.

No persisted explicit-grant mechanism exists yet. Membership roles therefore do not receive these capabilities: `care.read`, `kids.check-in.read`, `kids.safety.read` (Volunteers & Safety), and `church.ministries.read` for Church-wide Staff. Global roles currently receive all defined navigation capabilities. Revisit the mapping when adding new capabilities or when permissions need to differ by global role.
