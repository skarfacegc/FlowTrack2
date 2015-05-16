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
- Main collection loop works
    - Flows are captured and written to elasticsearch db

Next up
-------
- Performance testing
    + I want to see how fast this will actually go
    + Using a single node for ES
- Cleanup
    + First node project, I'm not thrilled with the overall structure
    + Break stuff into objects/libs
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


