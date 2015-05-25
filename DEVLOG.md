Ongoing devlog. Will cover research stuff, notes, and progress

2015.May.24
-----------
Added bunyan for logging.  Not super thrilled with the way I've integrated it, but it seems to work, and I can spruce it up later

2015.May.23
-----------
Got unit testing better.  Needed a little refactoring, and a bit more smarts in the stubs/spies.  Seems to be working now.

2015.May.21
-----------
Fought with adding unit tests and mocks/spies to ```NetFlowStorage```.  Couldn't quite figure it out.  Posted to stackoverflow.  

2015.May.19
-----------
I got unit testing setup and started along with code coverage.  Kinda stumbled into getting it working, not sure if I've chosen the right stack (mocha/chai/sinon/istanbul).

2015.May.17
-----------

Setup a scaffold using grunt.  Seems to be the right way to structure projects

First pass at moving stuff into a module/creating an object.  used the bind keyword in a callback to get access to the client property of the object.  Just kinda typed until things seemed to work, need to grok it at some pt.


2015.May.16
-----------
First major commit!

The main collector stuff works.  Grab flows, put them in ES.  Tried throwing a huge tcpreplay at it, system fell over pretty quickly, handles normal load quite well.  I want to play around with the replay to see how many flows per second I can actually take.

I'm not thrilled with the overall structure of the code.  I'm brand new to any significant javascript so I'm not comfortable with the idioms and "proper" way to do things.  First thing up is figuring out the package and object system.

Think I want to package my libs as local npm modules and I think grunt is the makefile to get everything working.








