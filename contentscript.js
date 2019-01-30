/*
Copyright (c) 2019, AlvinHKH
https://www.alvinhkh.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those
of the authors and should not be interpreted as representing official policies,
either expressed or implied, of the FreeBSD Project.
*/

const inject = (func) => {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.appendChild(document.createTextNode("(" + func + ")();"));
  document.addEventListener('DOMContentLoaded', (event) => { 
    document.body.appendChild(script);
  });
}

inject(() => {
  if (NMAFMediaPlayerControlProxy) {
    NMAFMediaPlayerControlProxy.acquire = (successCallback) => {
      if (current.checkoutData == null) {
        NMAFLogging.log("checkoutData == null");
      } else if (current.checkoutData.ccDomain == null || current.checkoutData.ccPoolType == null) {
        NMAFLogging.log("ccDomain: null or ccDomain doesn't exist or ccPoolType: null or ccPoolType doesn't exist");
        successCallback();
      } else {
        successCallback();
      }
      NMAFMediaPlayerController.player.volume = 0.5;
    }
  }
});