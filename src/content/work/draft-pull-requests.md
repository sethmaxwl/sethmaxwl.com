---
title: 'Draft Pull Requests'
description: 'How I helped developers share work early and signal intent clearly.'
thumbnail:
  src: '/images/draft-pull-requests.png'
  alt: 'A draft pull request button next to the create pull request button.'
  width: 695
  height: 188
externalLink:
  href: 'https://www.atlassian.com/blog/bitbucket/draft-pull-requests'
  label: 'Say hello to draft pull requests! And one more thing we think you’ll love.'
---

## The "WIP" Symptom

Opening a pull request usually implies that the work is ready for review.

This is the assumption that many reviewers have, at least. Developers often want
to share work early and get feedback on an approach before finishing all of the
implementation details, but this isn't necessarily a "reviewable" state. Other
developers like to open a draft to let CI run to completion before notifying
reviewers to take a look.

One pattern we used within Bitbucket was adding a WIP prefix in the pull request title
to signal to reviewers not to pay attention to the pull request yet, and we noticed
customers using similar techniques as well. But WIP is a thin barrier. There are no
protections against someone accidentally merging a pull request with WIP in the title.
There's also no way to filter out WIP pull requests from your review stack, causing
friction for both pull request authors and reviewers.

## Making WIP Feel Native

The goal was to make in-progress work a first-class part of the pull request flow.
A draft PR should be easy to create, clearly marked, and simple to move into a
"ready for review" state when the time is right.

My role focused on defining how to make that flow feel baked into Bitbucket. Developers
already defined an unofficial draft workflow that they had worked into their behavior.
We just needed to give these actions a formal state.

## The Small Signal That Changed the Conversation

What I enjoyed most about this project was how small the feature felt on the surface
and how meaningful it felt in practice.

Drafts did not reinvent the code review process. They just formalized a developer
workflow that we had been using for years.

Following the rollout of this project, we noticed that 1 in 5 of Atlassian-created
pull requests are opened as a draft, and 62% of all Bitbucket users who have opened
a draft pull request go on to use it repeatedly and often.
