# matlock

**matlock** is a multi-purpose worker application written entirely in JavaScript. I wrote it after being dissatisfied with having to load all manner of libraries, modules and packages just to build smart real-time apps in node.  **matlock** counts the time, then does things on time. It's also *tiny* (Under 3kb).

## So, it's a clock... 

Not exactly. It doesn't report GMT. It does understand duration (how long since?) and expiration (how long until?) For most real-time applications, this may be all you'll ever need to provide to your users.

## How does it work?

matlock executes entirely when setInterval() is called on DOM load and then restarts on the next page load. It just counts, and does things. The **event** API allows you to build state into your applications, but otherwise its purpose is concise--count and then execute stuff.

## What can I do with it?

Ideally, anything that requires a timing mechanism. Practically, here's a few examples:
- Build an application that checks stock updates every 6 hours and write them to a flat file or Database
- Build a turn-based game with and award points based on counters and incremented values.
- Ping your server(s) after a certain duration and give it special instructions.
- Periodically 'profile' users or content on your website for changes and trigger other events, like modals or AJAX form submissions.
- Lots more!

License
----
MIT

### Todos
 - More Tests
 - Finish README
 - Fix bakeCookie()
 - Add silentSquirrel



