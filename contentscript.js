/*
Copyright (c) 2018, AlvinHKH
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
  document.addEventListener("DOMContentLoaded", (event) => { 
    document.body.appendChild(script);
  });
}

// import hls.js
const s = document.createElement('script');
s.src = chrome.runtime.getURL('hls.js');
(document.head || document.documentElement).appendChild(s);

// set navigator.platform = "Linux"
const codeToInject = 'Object.defineProperty(navigator,"platform", { \
  get: function () { return "Linux"; }, \
  set: function (a) {} \
 });';
const script = document.createElement('script');
script.appendChild(document.createTextNode(codeToInject));
(document.head || document.documentElement).appendChild(script);

inject(() => {
  addTextTrack = (url, label, srclang, videoElement) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.responseText == null || xhr.responseText.length < 1) return;
        if (url.endsWith(".srt")) {
          const webvtt = srtToWebvtt(xhr.responseText);
          const track = createTextTrack(new Blob([webvtt], {type: 'text/vtt'}), label, srclang);
          videoElement.appendChild(track);
        } else {
          console.log('Unsupport type: ' + url);
        }
      }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
  };

  createTextTrack = (blob, label, srclang) => {
    window.URL = window.URL || window.webkitURL;
    const track = document.createElement('track'); 
    track.kind = 'subtitles'; 
    track.label = label; 
    track.srclang = srclang; 
    track.default = true;
    track.src = window.URL.createObjectURL(blob);
    return track;
  };

  srtToWebvtt = (data) => {
    // remove dos newlines
    let srt = data.replace(/\r+/g, '');
    // trim white space start and end
    srt = srt.replace(/^\s+|\s+$/g, '');
    // get cues
    const cuelist = srt.split('\n\n');
    let result = '';
    if (cuelist.length > 0) {
      result += 'WEBVTT\n\n';
      for (let i = 0; i < cuelist.length; i=i+1) {
        result += convertSrtCue(cuelist[i]);
      }
    }
    return result;
  };

  convertSrtCue = (caption) => {
    /*
    Copyright (c) 2014 Silvia Pfeiffer <silviapfeiffer1@gmail.com>
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */
    // remove all html tags for security reasons
    //srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, ''); 
    var cue = "";
    var s = caption.split(/\n/);
    var line = 0;
    if (s.length < 2) return cue; 
    // detect identifier
    if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
      cue += s[0].match(/\w/) + "\n";
      line += 1;
    }
    if (s[line].match(/\d+:\d+:\d+/)) {
      // get time strings
      var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
      if (m) {
        // convert time string
        cue += m[1]+":"+m[2]+":"+m[3]+"."+m[4]+" --> "
              +m[5]+":"+m[6]+":"+m[7]+"."+m[8]+"\n";
        line += 1;
      } else {
        // Unrecognized timestring
        return "";
      }
    } else {
      // file format error or comment lines
      return "";
    }
    if (s[line]) {
      // get cue text
      cue += s[line] + "\n\n";
    }
    return cue;
  };

  cpmsPageView = () => {
    const playHls = (video, mainVideoUrl) => {
      if (video == null || mainVideoUrl == null || mainVideoUrl.length < 0) return;
      video.setAttribute('autoplay', true);
      video.setAttribute('controls', true);
      video.volume = localStorage['np-volume'] || 0.5;
      video.addEventListener('volumechange', () => {
        localStorage['np-volume'] = video.volume;
      });
      video.addEventListener('canplay', () => {
        video.play();
      });
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toLowerCase() != "body") return;
        e.preventDefault();
        switch(e.which) {
          case 32: // space
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;
          case 37: // left
          video.currentTime -= 5
          break;
          case 38: // up
          if (video.volume + .1 > 1) {
            video.volume = 1;
          } else {
            video.volume += .1
          }
          break;
          case 39: // right
          video.currentTime += 5
          break;
          case 40: // down
          if (video.volume - .1 < 0) {
            video.volume = 0;
          } else {
            video.volume -= .1
          }
          break;
        }
      }, false);
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(mainVideoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_LOADED, () => {
          addTextTrack(mainVideoUrl.replace(/.m3u8?(.*)$/, '-TRD.srt'), '中文', 'tc', video);
        });
        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
          if (document.getElementById('select-audio-container')) {
            document.getElementById('select-audio-container').parentNode.removeChild(document.getElementById('select-audio-container'));
          }
          if (hls.audioTracks.length > 1) {
            const audioTracks = document.createElement('div');
            audioTracks.setAttribute('id', 'select-audio-container');
            audioTracks.setAttribute('style', 'margin: 8px; color: #fff; text-align: right;');
            const css = "display: inline-block; cursor: pointer; padding: 8px; margin: 8px; border: 2px solid #fff; border-radius: 8px;";
            for (let i = 0; i < hls.audioTracks.length; i++) {
              const audioTrack = document.createElement('div');
              audioTrack.setAttribute('style', css);
              audioTrack.appendChild(document.createTextNode(hls.audioTracks[i].name.toUpperCase()));
              audioTrack.addEventListener('click', (e) => {
                hls.audioTrackController.setAudioTrackInternal(i);
              });
              audioTracks.appendChild(audioTrack);
            }
            document.getElementById('html5_player').appendChild(audioTracks);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = mainVideoUrl;
        video.addEventListener('canplay', () => {
          addTextTrack(mainVideoUrl.replace(/.m3u8?(.*)$/, '-TRD.srt'), '中文', 'tc', video);
        });
      }
    };

    acquireToken = (isFirstTime, jqVideoObj, mainVideoUrl) => {
      FIRST_TIME_GET_TOKEN = isFirstTime;
      var params = new Array();
      params[PARAM_FSA] = FSA;
      params[PARAM_SERVICE_ID] = SERVICE_ID;
      params[PARAM_NETPASS_ID] = NETPASS_ID;
      params[PARAM_FMT] = FORMAT_JSON;
      var url = URL_ACQUIRE_TOKEN;
      if (SERVICE_ID == SERVICE_ID_FTA) {
        if (FIRST_TIME_GET_TOKEN) {
          playHls(jqVideoObj.get(0), mainVideoUrl);
        }
      } else {
        if (FIRST_TIME_GET_TOKEN) {
          playHls(jqVideoObj.get(0), mainVideoUrl);
          enablePlayerControl(jqVideoObj);
        }
      }
    };

    didLoadedMetadataInfo = (event) => {
      var jqVideoObj = event.data.jqVideoObj;
      if (IS_MAIN_VIDEO) {
        if (jqVideoObj.get(0).currentTime > 0) {
          VIDEO_TYPE = VIDEO_TYPE_LIVE;
        } else {
          VIDEO_TYPE = VIDEO_TYPE_VOD;
        }
      }
    };
  };
});