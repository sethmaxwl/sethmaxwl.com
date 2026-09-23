---
title: 'Understanding used to be free'
description: 'Why AI development needs deliberate mental friction to stay on track.'
date: 2026-09-22
coverImage: '/og-image.png'
---

When I wrote a function by hand, I ended up understanding it, not because I set out to but because there was no way to produce it without resolving every decision
without it. Reading the docs for an unfamiliar API, adding in debugging print statements, and thinking through the types and the data flows for the function were all
things I had to do to get an outcome at all, and the understanding behind all of that came as a natural consequence of that process. There was enough mental friction
involved between me and the outcome that forced me to fully understand what I had built.

Agents broke that link. The output arrives without the process that used to produce the understanding, and nothing in the default agentic workflow makes it obvious
that it isn't there. That's because the interesting failure in this flow isn't obvious at all unless you're really looking for it, and that's because it doesn't
produce any artifacts that would indicate a failure like a failed unit test or build.

The failure I care the most about is perfectly working code. That may seem counterintuitive to consider that a failure, but the agent's code that matches the
codebase's best practices, has sensible flows and naming schemes, and passes a code review can be a failure because it can be achieved with little to no directional
input required from the author. That becomes dangerous when something breaks in six months and someone has to reconstruct a rationale that doesn't exist outside of
the original context window.

I own that code either way, but with agentic help in this way I own it with a weaker model of it than I would have had if I had written it myself, and that makes it
harder to debug or explain your thinking later.

I encountered this issue when I first started working heavily with agent-assisted development. Here's how I have managed to reduce this problem.

## Decide before the code exists

I've put a set of checkpoints into my agent's instructions. For non-trivial code changes, it has to:

1. Investigate and propose a plan before editing anything.
2. Bring material product and architecture decisions to me for approval.
3. Implement one coherent slice at a time, then stop for review.

Adding steps in the process to keep me involved with the work is what adds value here.

These give me somewhere to interject before it gets too far off the rails and it becomes harder to reconcile later. I can look at where the state will live, which
part of the system will own the behavior, and what we're assuming about the contract between them. Those choices can look like implementation details, but they can
really set the direction of the whole change.

This introduces waiting into a process that could otherwise keep moving, and that's a cost that I find is worth paying. The agent being able to continue doesn't tell
me whether I understand enough about its intended direction to let it.

## Make me answer first

For each slice, I ask the agent to walk through the runtime flow. I want the state going in, what changes it, which consumers react, and what's left unresolved.

I also ask it to include backtracking and failed approaches. A clean final explanation can leave out the detail that makes the design make sense. This gives us the why
an agent took the path it did, and it lets me suggest alternatives if I notice it missed an important consideration.

But there's still a problem with being given an explanation. I can follow it sentence by sentence and feel that I understand the change without producing any of that
reasoning myself.

So before my agent presents a substantial change as ready for a pull request, it has to ask me five questions to answer:

1. What breaks if this change is wrong?
2. Why did this approach win out against the others?
3. What part am I least certain about?
4. Which assumptions does the change depend on?
5. What does the validation evidence actually establish?

Without this last step, the whole exercise of having the work be done in slices is performative. It ensures that I really do understand the implications of the changes
I've orchestrated and how it affects the other parts of the codebase.

An incomplete answer gives me something specific to investigate. If I can't explain what breaks, I need to follow the failure path. If I can't explain why we rejected
an alternative approach, that highlights a decision I didn't fully think through. If I can't explain what the tests establish, I'm relying on a green result without
looking at what the tests are testing for.

This is what I mean by mental friction. It points me at the part of the change I'd otherwise discover I didn't understand much later.

## Document what the code doesn't tell me

I also ask my agent to rank the changed hunks by order of significance. For the top three, it has to state the assumption each one makes and the observable evidence
that would show that assumption is false.

This gives me a way to decide where to look inside the diff. The amount of code changed tells me very little about the consequences of being wrong. I want the
assumption underneath the risky change stated plainly. That gives me a claim I can check against the surrounding system.

Validation needs the same precision. I ask for the checks that ran, what they exercised, and what couldn't be verified. A passing test gives me evidence about what behavior it covered, but an unavailable testing environment leaves a gap. I keep those facts separate when deciding whether the change is ready.

The final handoff also has to include decisions, rejected alternatives, unresolved questions, and assumptions we couldn't verify. Those details are what I carry into the pull request or the documentation that sits alongside the code. I don't need to preserve the entire conversation. I just need to preserve the reasoning that would help a future maintainer reconstruct the reasoning.

---

I still want the speed that agentic development brings. I want to spend less time on mechanical work and more time exploring implementations. Some of that saved time
needs to go towards understanding the decisions I'm accepting.

Writing the code used to make me spend that attention automatically, but now I have to choose where to spend it and build a workflow that makes it harder to skip.
