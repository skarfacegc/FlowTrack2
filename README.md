[![Build Status](https://travis-ci.org/skarfacegc/FlowTrack2.svg)](https://travis-ci.org/skarfacegc/FlowTrack2) [![Test Coverage](https://codeclimate.com/github/skarfacegc/FlowTrack2/badges/coverage.svg)](https://codeclimate.com/github/skarfacegc/FlowTrack2/coverage) [![Code Climate](https://codeclimate.com/github/skarfacegc/FlowTrack2/badges/gpa.svg)](https://codeclimate.com/github/skarfacegc/FlowTrack2) [![Dependency Status](https://david-dm.org/skarfacegc/FlowTrack2.svg)](https://david-dm.org/skarfacegc/FlowTrack2) [![waffle.io](https://img.shields.io/badge/waffle.io-roadmap%2Fissues-lightgrey.svg)](https://waffle.io/skarfacegc/flowtrack2)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/skarfacegc.svg)](https://saucelabs.com/u/skarfacegc)



FlowTrack2
==========

This is my rewrite of [FlowTrack](https://github.com/skarfacegc/FlowTrack) in node and elastic search.

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
- Unit tests are a little cleaner now. 
- Start web UI
- Added config file system
- Add table view of flows to web UI
    
Next up (in no particular order)
-------
- Performance testing
    + I want to see how fast this will actually go
    + Using a single node for ES




Install
-------

- Have a running elastic search instance
    - Currently assumes localhost:9200
- have a working node + npm
- sends bunyan logs to stdout, no way to turn off currently.
- Webserver is running on port 3000
```
git clone https://github.com/skarfacegc/FlowTrack2.git
cd FlowTrack2.git
npm install
bin/flowTrack
```


