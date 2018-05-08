# NowPlayer Extension
NowPlayer Extension is an extension which let you watch content on nowplayer.now.com in Chrome or Firefox by enabling html5 support on now player. *This extension does NOT bypass the requirement of now subscription.*


## How to use (Chrome)
1. [Download ZIP](https://github.com/alvinhkh/nowplayer-extension/archive/master.zip)
2. Unzip downloaded file
3. Type chrome://extensions in your Chrome browser
4. Enable "Developer mode"
5. "Load unpacked" from folder where you unpacked the extension


## Technical details
- Inject "Access-Control-Allow-Origin" to bypass CORS
- Using hls.js to show HLS content in chrome native html5 player
- Retrive SRT subtitle and convert into WebVTT in order to show subtitle in chrome native html5 player
- Added keyboard shortcuts to the player
    - (space): play / pause
    - (up/down): volume
    - (left/right): +-5 seconds 


## Known Issues
- Some channels and contents (e.g. HBO) won't play.


## License
	Copyright (c) 2018, AlvinHKH
	https://www.alvinhkh.com
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, 
	are permitted provided that the following conditions are met:

	1. Redistributions of source code must retain the above copyright notice, 
	this list of conditions and the following disclaimer.
	
	2. Redistributions in binary form must reproduce the above copyright notice, 
	this list of conditions and the following disclaimer in the documentation and/or 
	other materials provided with the distribution.
	
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR 
	IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND 
	FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR 
	CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
	DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
	DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER 
	IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT 
	OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.