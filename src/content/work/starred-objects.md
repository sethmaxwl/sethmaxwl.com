---
title: "Starred Objects"
description: "Building an in-product bookmark to solve a common customer pain point."
thumbnail:
    src: "/images/starred-objects.png"
    alt: "A new section in the Bitbucket navigation showing starred repositories."
externalLink:
    href: "https://community.atlassian.com/forums/Bitbucket-articles/New-in-Bitbucket-starred-items/ba-p/3238707"
    label: "New in Bitbucket: starred items!"
---
During my first year at Bitbucket, and my first year out of college, I took part in some user research sessions as a part
of a project where we were
[revamping our navigation](https://www.atlassian.com/blog/bitbucket/improving-navigation-for-bitbucket-users).
During these sessions, I learned that many users, internal and external, primarily navigate the site through browser bookmarks.

I didn't find Bitbucket particularly hard to navigate, so this surprised me. But as I learned more about real user
flows, I saw how people had frequently accessed pages scattered across a wide range of surfaces that
took multiple clicks to navigate between.

But due to other project priorities and limited staffing, we didn't invest any time to solve this problem then.
That was in 2022.

## Another Navigation Update is the Catalyst
This same pain point resurfaced in Bitbucket during another [navigation refresh](https://www.atlassian.com/blog/bitbucket/bitbucket-new-navigation-is-here)
I was a part of at the end of 2025.
We were adopting a new navigation system that was already being used by Jira, Confluence, and the other Atlassian apps.
As we rolled it out, the most common issue that customers reported is how hard it remained to get to the
repositories they went to the most.
> *Where did my repository go??*

This was more of a problem now that the new navigation system allowed multiple repositories to be in view at the same time.
A repository could fall out of the most recently viewed list of repositories and had to be found again through other means.

## Bitbucket Bookmarks - Now Seamless!
Since we didn't previously have any concept of a starred object (both Jira and Confluence did) we settled on having
repositories and projects as the two object types to have starrable.

I also spent a lot of time on this project sweating the small stuff. Things like:
* Optimistically updating starred/unstarred states to make actions feel instant.
* Preserving collapsed state between "Starred" and "Recent" section transitions.
* Maintaining the last viewed repository and forcing it expanded when the view mode is set to show only the most recently viewed object.

## Success Looked Like Silence
After rolling this feature out, the volume of navigation complaints dropped dramatically. Thousands of users have opted to
star repositories and projects that matter to them, and while this feature is meant to be a set and forget type of thing,
there continues to be over 1k new starred objects added every day.
