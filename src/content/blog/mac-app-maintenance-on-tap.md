---
title: "Mac App Maintenance, on Tap"
description: "How I use Homebrew, a Brewfile, and a small upgrade script to keep my Mac environment up to date and easily manageable."
date: 2026-05-22
---

## One File to Brew Them All
Setting up a Mac can get messy, fast. You might install a handful of CLI tools, desktop apps, and VS Code extensions. Before long your computer is full of things installed from a variety of sources. If you're as
obsessive about keeping your apps up to date as I am, this becomes a nightmare to manage.

That is why I decided one day to keep all of my software installs in a `Brewfile`.

It gives me one source of truth for all apps and tools I have installed on my computer that I use daily.
I created it by running `brew bundle dump` to list out everything I had already installed through homebrew
and then moved all my desktop apps over to be tracked in homebrew with `brew install <app-name> --cask --adopt`.

## Cask Me Anything
My favorite part of this setup is that I can install desktop apps through Homebrew casks instead of having
to drag and drop them into `/Applications` through mounted `.dmg` files. I add them to the Brewfile as casks
instead:

```brewfile
cask "arc"
cask "codex"
cask "iterm2"
cask "visual-studio-code"
```

That keeps desktop apps in the same system as everything else.

It also makes a new Mac super easy to set up. I can copy my `Brewfile` over to the new machine and run
`brew bundle install` to install all of the apps, tools, and extensions I had on my old machine.

## The "Update All" Button
I also use a small [Fish](https://fishshell.com/) function called `run-updates` :
```shell
function run-updates
    brew update && brew upgrade && brew upgrade --cask --greedy && brew cleanup
end
```

It updates Homebrew, my installed packages and desktop apps, and cleans up old files.

The `--cask --greedy` part is important because it tells Homebrew to upgrade cask apps more aggressively,
including apps that might otherwise be skipped because they manage their own updates.

## Tiny Habits, Happier Macs
None of this is especially clever, but that's kind of the point. I was falling into the trap of having apps
and CLI tools installed in so many places that I couldn't remember what I had installed or how to update them.
This makes it easy for me to keep a handle on what I have installed, remove what isn't needed anymore, and
keep my software up to date without any effort.