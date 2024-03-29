export default {
    generateRandomString() {
        const crypto = window.crypto || window.msCrypto;
        let array = new Uint32Array(1);

        return crypto.getRandomValues(array);
    },


    closeVideo(elemId) {
        if (document.getElementById(elemId)) {
            document.getElementById(elemId).remove();
            this.adjustVideoElemSize();
        }
    },


    pageHasFocus() {
        return !(document.hidden || document.onfocusout || window.onpagehide || window.onblur);
    },


    getQString(url = '', keyToReturn = '') {
        url = url ? url : location.href;
        let queryStrings = decodeURIComponent(url).split('#', 2)[0].split('?', 2)[1];

        if (queryStrings) {
            let splittedQStrings = queryStrings.split('&');

            if (splittedQStrings.length) {
                let queryStringObj = {};

                splittedQStrings.forEach(function (keyValuePair) {
                    let keyValue = keyValuePair.split('=', 2);

                    if (keyValue.length) {
                        queryStringObj[keyValue[0]] = keyValue[1];
                    }
                });

                return keyToReturn ? (queryStringObj[keyToReturn] ? queryStringObj[keyToReturn] : null) : queryStringObj;
            }

            return null;
        }

        return null;
    },


    userMediaAvailable() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    },


    getUserFullMedia() {
        if (this.userMediaAvailable()) {
            return navigator.mediaDevices.getUserMedia({
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
        }

        else {
            throw new Error('User media not available');
        }
    },


    getUserAudio() {
        if (this.userMediaAvailable()) {
            return navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
        }

        else {
            throw new Error('User media not available');
        }
    },



    shareScreen() {
        if (this.userMediaAvailable()) {
            return navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });
        }

        else {
            throw new Error('User media not available');
        }
    },


    getIceServer() {
        return {
            iceServers: [
                {
                    urls: ["stun:eu-turn4.xirsys.com"]
                },
                {
                    username: "ml0jh0qMKZKd9P_9C0UIBY2G0nSQMCFBUXGlk6IXDJf8G2uiCymg9WwbEJTMwVeiAAAAAF2__hNSaW5vbGVl",
                    credential: "4dd454a6-feee-11e9-b185-6adcafebbb45",
                    urls: [
                        "turn:eu-turn4.xirsys.com:80?transport=udp",
                        "turn:eu-turn4.xirsys.com:3478?transport=tcp"
                    ]
                }
            ]
        };
    },


    addChat(data, senderType) {
        let chatMsgDiv = document.querySelectorAll('.chat-messages');
        let contentAlign = 'justify-content-end';
        // let contentAlign = 'justify-content-around';
        let senderName = 'You';
        let msgBg = 'bg-white';

        if (senderType === 'remote') {
            contentAlign = 'justify-content-start';
            // let contentAlign = 'justify-content-around';
            senderName = data.sender;
            msgBg = '';

            this.toggleChatNotificationBadge();
        }

        
        let infoDiv = document.createElement('div');
        let infoDiv1 = document.createElement('div');

        infoDiv.className = 'sender-info';
        infoDiv1.className = 'sender-info';

        infoDiv.innerHTML = `${senderName} : ${moment().format('h:mm a')}`;
        infoDiv1.innerHTML = `${senderName} : ${moment().format('h:mm a')}`;

        let colDiv = document.createElement('div');
        let colDiv1 = document.createElement('div');

        colDiv.className = `col-10 card chat-card msg ${msgBg}`;
        colDiv1.className = `col-10 card chat-card msg ${msgBg}`;

        colDiv.innerHTML = xssFilters.inHTMLData(data.msg).autoLink({ target: "_blank", rel: "nofollow" });
        colDiv1.innerHTML = xssFilters.inHTMLData(data.msg).autoLink({ target: "_blank", rel: "nofollow" });

        let rowDiv = document.createElement('div');   
        let rowDiv1 = document.createElement('div');

        rowDiv.className = `row ${contentAlign} mb-2`;
        rowDiv1.className = `row ${contentAlign} mb-2`;


        colDiv.appendChild(infoDiv);
        colDiv1.appendChild(infoDiv1);

        rowDiv.appendChild(colDiv);
        rowDiv1.appendChild(colDiv1);

        
        chatMsgDiv[0].appendChild(rowDiv);
        chatMsgDiv[1].appendChild(rowDiv1);

        /**
         * Move focus to the newly added message but only if:
         * 1. Page has focus
         * 2. User has not moved scrollbar upward. This is to prevent moving the scroll position if user is reading previous messages.
         */
        if (this.pageHasFocus) {
            rowDiv.scrollIntoView();
            rowDiv1.scrollIntoView();
        }
    },


    toggleChatNotificationBadge() {
        if (document.querySelector('#chat-pane').classList.contains('chat-opened')) {
            document.querySelector('#new-chat-notification').setAttribute('hidden', true);
        }

        else {
            document.querySelector('#new-chat-notification').removeAttribute('hidden');
        }
    },



    replaceTrack(stream, recipientPeer) {
        let sender = recipientPeer.getSenders ? recipientPeer.getSenders().find(s => s.track && s.track.kind === stream.kind) : false;

        sender ? sender.replaceTrack(stream) : '';
    },



    toggleShareIcons(share) {
        let shareIconElem = document.querySelector('#share-screen');

        if (share) {
            shareIconElem.setAttribute('title', 'Stop sharing screen');
            shareIconElem.children[0].classList.add('text-primary');
            shareIconElem.children[0].classList.remove('text-white');
        }

        else {
            shareIconElem.setAttribute('title', 'Share screen');
            shareIconElem.children[0].classList.add('text-white');
            shareIconElem.children[0].classList.remove('text-primary');
        }
    },


    toggleVideoBtnDisabled(disabled) {
        document.getElementById('toggle-video').disabled = disabled;
    },


    maximiseStream(e) {
        let elem = e.target.parentElement.previousElementSibling;

        elem.requestFullscreen() || elem.mozRequestFullScreen() || elem.webkitRequestFullscreen() || elem.msRequestFullscreen();
    },


    singleStreamToggleMute(e) {
        if (e.target.classList.contains('fa-microphone')) {
            e.target.parentElement.previousElementSibling.muted = true;
            e.target.classList.add('fa-microphone-slash');
            e.target.classList.remove('fa-microphone');
        }

        else {
            e.target.parentElement.previousElementSibling.muted = false;
            e.target.classList.add('fa-microphone');
            e.target.classList.remove('fa-microphone-slash');
        }
    },



    showUserAudioState(e) {
        if (e.target.classList.contains('fa-microphone-alt-slash')) {
            e.target.parentElement.previousElementSibling.muted = true;
            // e.target.classList.add( 'fa-microphone-alt-slash' );
            // e.target.classList.remove( 'fa-microphone' );
        }
    },




    saveRecordedStream(stream, user) {
        let blob = new Blob(stream, { type: 'video/webm' });

        let file = new File([blob], `${user}-${moment().unix()}-record.webm`);

        saveAs(file);
    },


    toggleModal(id, show) {
        let el = document.getElementById(id);

        if (show) {
            el.style.display = 'block';
            el.removeAttribute('aria-hidden');
        }

        else {
            el.style.display = 'none';
            el.setAttribute('aria-hidden', true);
        }
    },



    setLocalStream(stream, mirrorMode = true) {
        const localVidElem = document.getElementById('local');

        localVidElem.srcObject = stream;
        mirrorMode ? localVidElem.classList.add('mirror-mode') : localVidElem.classList.remove('mirror-mode');
    },


    setPreviewStream(stream, mirrorMode = true) {
        const previewVidElem = document.getElementById('preview-video');

        previewVidElem.srcObject = stream;
        mirrorMode ? previewVidElem.classList.add('mirror-mode') : previewVidElem.classList.remove('mirror-mode');
    },


    adjustVideoElemSize() {
        let elem = document.getElementsByClassName('card');
        let totalRemoteVideosDesktop = elem.length;
        // let newMargin = totalRemoteVideosDesktop <= 32 ? '0.05%' : ('0.0%');
        let newWidth = totalRemoteVideosDesktop <= 2 ? '33.33%' : (
            totalRemoteVideosDesktop == 3 ? '33.33%' : (
                totalRemoteVideosDesktop <= 8 ? '20%' : (
                    totalRemoteVideosDesktop <= 15 ? '20%' : (
                        totalRemoteVideosDesktop <= 18 ? '16%' : (
                            totalRemoteVideosDesktop <= 23 ? '15%' : (
                                totalRemoteVideosDesktop <= 32 ? '12%' : '10%'
                            )
                        )
                    )
                )
            )
        );


        for (let i = 0; i < totalRemoteVideosDesktop; i++) {
            elem[i].style.width = newWidth;
            // elem[i].style.margin = newMargin;
        }
    },


    createDemoRemotes(str, total = 6) {
        let i = 0;

        let testInterval = setInterval(() => {
            let newVid = document.createElement('video');
            newVid.id = `demo-${i}-video`;
            newVid.srcObject = str;
            newVid.autoplay = true;
            newVid.className = 'remote-video';
            
            //video controls elements
            let controlDiv = document.createElement('div');
            controlDiv.className = 'remote-video-controls';
            controlDiv.innerHTML = `<h6 style="color: white">${data.sender}</h6>
                        <i class="fa fa-microphone text-white pr-3 mute-remote-mic" title="Mute"></i>
                        <i class="fas fa-thumbtack text-white expand-remote-video" title="Pin"></i>`;

            let audioStateDiv = document.createElement('div');
            audioStateDiv.className = 'audio-state';
            audioStateDiv.innerHTML = `<i class="fa-microphone-alt-slash text-white pr-3" title="Muted"></i>`;

            //create a new div for card
            let cardDiv = document.createElement('div');
            cardDiv.className = 'card card-sm user-video';
            cardDiv.id = `demo-${i}`;
            cardDiv.appendChild(newVid);
            cardDiv.appendChild(controlDiv);
            cardDiv.appendChild(audioStateDiv);

            //put div in main-section elem
            document.getElementById('videos').appendChild(cardDiv);

            this.adjustVideoElemSize();

            i++;

            if (i == total) {
                clearInterval(testInterval);
            }
        }, 2000);
    }
};
