# Express Flash Plus
Flash Messages for your Express Application

Flash is an extension of `connect-flash` with the ability to define a flash message and render it without redirecting the request.

`express-flash-plus` is a fork of the original `express-flash` module but it contains several pull request the original repo still have not been accepted:
- @onnlucky
This fixes empty sessions being created when there are no flashes.
- @Fardinak
This adds a name to the main function for debugging
- @creativetechnologylab
This extends the functionality to provide an array of flashes that can be iterated over, rather than using the messages system which doesn't support multiple flashes of the same type, the example code for PUG/Jade also results in less duplicated code.
- @ual-cci
Updated all the package versions to fix security issues then repaired broken tests from major/breaking version changes, moved from Jade to PUG, etc...

## Installation
Works with Express 4.x.x

npm install express-flash-plus

## Usage
Set it up the same way you would `connect-flash`, see `./examples`


## License

(The MIT License)

Copyright (c) 2012 RGBboy &lt;me@rgbboy.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
