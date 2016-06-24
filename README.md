# Skinny Interval

**Skinny Interval** is a multi-purpose worker application written in pure JavaScript. I wrote it after being dissatisfied with having to load all manner of libraries, modules and packages just to build smart real-time apps in node.  **Skinny Interval** counts the time, then does things on time. It's also *tiny* (Under 3kb).

## So, it's a clock... 

Not exactly. It doesn't report GMT. It does understand duration (how long since?) and expiration (how long until?) For most real-time applications, this may be all you'll ever need to provide to your users. Skinny Interval executes on a setInterval loop. It's called on DOM load and then restarts on the next page load. It just counts, and does things. The **event** API allows you to build state into your applications, but otherwise its purpose is concise--count and then execute stuff when you want it to.

## Advantages ##

- Doesn't require node (or any other dependencies).
- Runs in any browser on the planet, as long as JavaScript is supported.
- It's fast and small. 

## Disadvantages ##

- It's pretty dumb.
- The only 'back-office' is a single setInterval() loop.

## What can I do with it?

Ideally, anything that requires a timing mechanism. Practically, here's a few examples:
- Build a turn-based game with and award points based on counters and incremented values.
- Ping your server(s) after a certain duration and give it special instructions.
- Periodically touch users or content on your website.
- Lots more!

License
----
MIT

### Todos
 - More Tests
 - Finish README
 - Fix bakeCookie()
 - Add silentSquirrel



