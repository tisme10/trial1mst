import helpers from './helpers.js';

window.addEventListener('load', () => {

    //when the "Start Meeting" button on the main chat is pressed
    document.getElementById('start-meeting').addEventListener('click', (e) => {
        let chatElem = document.querySelectorAll('.chat-pane');
        document.getElementById("chat-pane1").setAttribute('hidden', true);
    });

    //When the chat icon is clicked
    document.querySelector('#toggle-chat-pane').addEventListener('click', (e) => {
        let chatElem = document.querySelectorAll('.chat-pane');
        let mainSecElem = document.querySelector('#main-section');

        if (chatElem[0].classList.contains('chat-opened')) {
            chatElem[0].setAttribute('hidden', true);
            mainSecElem.classList.remove('col-md-9');
            mainSecElem.classList.add('col-md-12');
            chatElem[0].classList.remove('chat-opened');
        }

        else {
            chatElem[0].attributes.removeNamedItem('hidden');
            mainSecElem.classList.remove('col-md-12');
            mainSecElem.classList.add('col-md-9');
            chatElem[0].classList.add('chat-opened');
        }

        //remove the 'New' badge on chat icon (if any) once chat is opened.
        setTimeout(() => {
            if (document.querySelector('#chat-pane').classList.contains('chat-opened')) {
                helpers.toggleChatNotificationBadge();
            }
        }, 300);
    });



    //When the 'Create room" is button is clicked
    document.getElementById('create-room').addEventListener('click', (e) => {
        e.preventDefault();

        let roomName = document.querySelector('#room-name').value;
        let yourName = document.querySelector('#your-name').value;

        if (roomName && yourName) {
            //remove error message, if any
            document.querySelector('#err-msg').innerHTML = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem('username', yourName);

            //create room link
            let roomLink = `${location.origin}?room=${roomName.trim().replace(' ', '_')}_${helpers.generateRandomString()}`;

            //show message with link to room

            document.querySelector('#room-created').innerHTML = `
            <div style="padding-top: 20px; color: white">
                <a href="${roomLink}" style="text-decoration: none;" target="blank">
                    <button class="btn btn-block rounded-pill homepageButton" id="join-room" style="height: 54px; width: 250px;">Join Room</button>
                </a>
                <div style="padding-top: 20px; color: white;">
                    <h5 style="padding-left: 4.6rem;">Share Invite</h5>
                    <h6>${roomLink}</h6>
                </div>
            <div>
            `;

            

            //empty the values
            document.querySelector('#room-name').value = '';
            document.querySelector('#your-name').value = '';

        }

        else {
            document.querySelector('#err-msg').innerHTML = "Please enter the details";
        }
    });


    //When the 'Enter room' button is clicked.
    document.getElementById('enter-room').addEventListener('click', (e) => {
        e.preventDefault();

        let name = document.querySelector('#username').value;

        if (name) {
            //remove error message, if any
            document.querySelector('#err-msg-username').innerHTML = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem('username', name);

            //reload room
            location.reload();
        }

        else {
            document.querySelector('#err-msg-username').innerHTML = "Please enter the details";
        }

        //add name overlay to remote video pane
        if (document.querySelector('.remote-video-controls')) {
            let remoteVideo = document.querySelector('.remote-video-controls');
            let remoteUsername = document.querySelector('#your-name').value;
            var name1 = document.createElement("p");
            name1.classList.add("name");
            name1.append(document.createTextNode(remoteUsername));
            remoteVideo.appendChild(name1);
        }
    });







    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('expand-remote-video')) {
            helpers.maximiseStream(e);
        }

        else if (e.target && e.target.classList.contains('mute-remote-mic')) {
            helpers.singleStreamToggleMute(e);
        }
    });








    document.getElementById('toggle-mute').addEventListener('click', (e) => {

        if (e.target && e.target.classList.contains('fa-microphone-alt-slash')) {
            helpers.showUserAudioState(e);
        }
    });

    // document.addEventListener( 'dblclick', ( e ) => {
    //     if ( e.target && e.target.classList.contains( 'participant-videos' ) ) {
    //         helpers.maximiseStream( e );
    //     }

    //     else if ( e.target && e.target.classList.contains( 'mute-remote-mic' ) ) {
    //         helpers.singleStreamToggleMute( e );
    //     }
    // } );



    document.getElementById('closeRecordModal').addEventListener('click', () => {
        helpers.toggleModal('recording-options-modal', false);
    });



    document.getElementById('share').addEventListener('click', (e) => {

        // var copyText = window.location.href;
        // copyText.select().value;
        // document.execCommand("copy");


        var dummy = document.createElement('input'),
            text = window.location.href;

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);


    });




    //load main chat as soon as the room is opened
    let helperCheckButton = document.querySelector('.room-comm');
    if (!helperCheckButton.hasAttribute('hidden')) {
        let chatElem = document.querySelector('.chat-pane1');
        chatElem.attributes.removeNamedItem('hidden');
        chatElem.classList.add('chat-opened');
    }


    //load main chat as soon as the leave meeting button is pressed
    document.getElementById('leave').addEventListener('click', (e) => {
        let chatElem = document.querySelector('.chat-pane1');
        chatElem.attributes.removeNamedItem('hidden');
        chatElem.classList.add('chat-opened');
    });

    // //add name overlay to remote video pane
    // if (document.querySelector('.user-video')) {
    //     let remoteVideo = document.querySelector('.participant-videos');
    //     let remoteUsername = document.querySelector('#your-name').value;
    //     var name = document.createElement("p");
    //     name.classList.add("name");
    //     name.append(document.createTextNode(remoteUsername));
    //     remoteVideo.appendChild(name);
    // }
});
