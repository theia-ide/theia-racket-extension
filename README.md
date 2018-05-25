# Theia Racket Extension [![Build Status](https://travis-ci.org/theia-ide/theia-racket-extension.svg?branch=master)](https://travis-ci.org/theia-ide/theia-racket-extension)
[Racket](https://racket-lang.org/) language support for
[Theia](https://github.com/theia-ide/theia) using the
[Racket Language Server](https://github.com/theia-ide/racket-language-server).

## Getting Started
Install yarn.
```sh
npm install -g yarn
```

Install the racket-language-server.
```sh
raco pkg install racket-language-server
```
Make sure that `~/.racket/$RACKET-VERSION/bin` is on your PATH.

Build.
```sh
git clone https://github.com/theia-ide/theia-racket-extension
cd theia-racket-extension
yarn
```

#### Run the browser example
```sh
cd browser-app
yarn start
```
Open http://localhost:3000 in the browser.

#### Run the electron example
```sh
cd electron-app
yarn start
```

## License
Copyright 2018 David Craven and others

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
