[![Build Status](https://travis-ci.org/skarfacegc/FlowTrack2.svg)](https://travis-ci.org/skarfacegc/FlowTrack2) [![Test Coverage](https://codeclimate.com/github/skarfacegc/FlowTrack2/badges/coverage.svg)](https://codeclimate.com/github/skarfacegc/FlowTrack2/coverage) [![Code Climate](https://codeclimate.com/github/skarfacegc/FlowTrack2/badges/gpa.svg)](https://codeclimate.com/github/skarfacegc/FlowTrack2) 

FlowTrack2
==========

This is my rewrite of [FlowTrack](https://github.com/skarfacegc/FlowTrack) in node and elastic search.

Tracking user stories / issues with [waffle.io](https://waffle.io/skarfacegc/FlowTrack2)

Why?
---

- Want to learn something new
- The time bucketing code was annoying to write, elastic search seems to do it automatically.
- scale.  This will be able to handle more than sqlite.


Progress
--------
Take a look at the [DevLog](https://github.com/skarfacegc/FlowTrack2/blob/master/DEVLOG.md) to see more detail

- Main collection loop works
    - Flows are captured and written to elasticsearch db
- Setup a grunt scaffold
    + seems to be the right way to go
- Created flow storage lib
    + I think it's created cleanly, I'm sure I'll notice stuff as I learn more.
- Unit testing & Code Coverage setup added
    + Not super happy with it, want to look at something other than istanbul
    
Next up (in no particular order)
-------
- Performance testing
    + I want to see how fast this will actually go
    + Using a single node for ES
- Config file
    + Create a config file to pull constants
    + possible commandline override
- Start web UI


Install
-------

- Have a running elastic search instance
    - Currently assumes localhost:9200
- have a working node + npm
```
git clone https://github.com/skarfacegc/FlowTrack2.git
cd FlowTrack2.git
npm install
node flowTrack.js
```


