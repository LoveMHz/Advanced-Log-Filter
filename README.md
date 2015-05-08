# Chrome Extension - Advanced Log Filter

![](https://github.com/LoveMHz/Advanced-Log-Filter/blob/master/preview.png)

Chrome Extension - Advanced Log Filter was written to add simple filtering options to the Chrome Devtool's console. It works based off console.log() calls that begin with a 'tag name' inside of two brackets, such as console.log('[UI_SYSTEM] Something went wrong!');

## Installation

Navigate to chrome://extensions
Expand the developer dropdown menu and click "Load Unpacked Extension"
Navigate to local folder
Assuming there are no errors, the extension should load into your browser

## Usage
console.log('[MYTAG] Message');

## Known Issues

Currently we're having to use a white listed Chrome Extension ID to allow us to inject JS into the devtools window. Thus, this extension is not compatible with Discover DevTools Companion.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Wish List

Alphabetical sorting of tags.

Remove need for using white listed Chrome extension ID.

## Credits

Original owner: CabinsForYou

## License

Ownership of this plugin was transferred to Dustin Holden on May 6th 2015 from CabinsForYou at which time the Apache License, Version 2.0 license was applied.

Copyright 2015 Dustin Holden

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.