##
[![Hexlet Ltd. logo](https://raw.githubusercontent.com/Hexlet/hexletguides.github.io/master/images/hexlet_logo128.png)](https://ru.hexlet.io/pages/about?utm_source=github&utm_medium=link&utm_campaign=nodejs-package)

Educational "Project #2" is being developed as part of "Backend Javascript (node.js)" profession studying on Hexlet.  
[Read more about Hexlet (in Russian)](https://ru.hexlet.io/pages/about?utm_source=github&utm_medium=link&utm_campaign=nodejs-package).
##

# Config difference generator
Compares two configuration files and shows a difference.

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fushachev%2Fbackend-project-lvl2%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/ushachev/backend-project-lvl2/goto?ref=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/cf8e444c79a3b4fee878/maintainability)](https://codeclimate.com/github/ushachev/backend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/cf8e444c79a3b4fee878/test_coverage)](https://codeclimate.com/github/ushachev/backend-project-lvl2/test_coverage)

## Setup

```sh
$ make install
```

## Application launch

```sh
$ make publish
$ sudo npm link
```
this will create a symlink to the package after that it will become possible to use the package as a library in your project

```sh
$ cd your/project/diretory
$ npm link genDiff
```
like this

[![asciicast](https://asciinema.org/a/SeHXXvH4yzyDE57RRSH8OjzJA.svg)](https://asciinema.org/a/SeHXXvH4yzyDE57RRSH8OjzJA)

or launch the application from the command line by typing

```sh
$ gendiff
```
like this

[![asciicast](https://asciinema.org/a/PMofhfyqQVimjjeGh5ouPLnPo.svg)](https://asciinema.org/a/PMofhfyqQVimjjeGh5ouPLnPo)
[![asciicast](https://asciinema.org/a/wUNqYX5xmN5tAw50xDzkGyADu.svg)](https://asciinema.org/a/wUNqYX5xmN5tAw50xDzkGyADu)
[![asciicast](https://asciinema.org/a/2rq9oYXEcJVbffvkmlEzzWboV.svg)](https://asciinema.org/a/2rq9oYXEcJVbffvkmlEzzWboV)
[![asciicast](https://asciinema.org/a/lewlj7l60MsPvjuydX6oW9vSO.svg)](https://asciinema.org/a/lewlj7l60MsPvjuydX6oW9vSO)
