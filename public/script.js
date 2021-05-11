/* createRoom */
const socket = io();
const userVideo = document.createElement('video')
const videoGrid = document.getElementById('video-grid')

const peer = new Peer(socket.id, {
    port: '443'
})



// Extras
document.getElementById('roomId-input').value = ROOM_ID;
document.getElementById('userName').innerHTML = `<span style="color:white;font-weight:700;">Name: </span> ${USER_NAME}`;

let myVideoStream;
let userName = USER_NAME;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    streamVideo(userVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            streamVideo(video, userVideoStream)
        })
    })

    socket.on('join-user', (userId) => {
        connectUser(userId, stream);
    })

})





const streamVideo = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video);
    //alert(videoGrid)

}

// Peer
peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id)
})

// Connection




const connectUser = (userId, stream) => {
    //alert(userName)
    // Peer Call
    /*
    var call = peer.call(userId, stream);
    call.on('stream', remoteStream => {
        let alerts = document.getElementById('alerts');
        alerts.innerHTML = `<h5>New User Joined</h5>`
        $('html').keydown((e) => {
            if (e.keyCode === 13) {
                alerts.innerHTML = `<h5></h5>`
            }
        })
        let body = document.body
        body.addEventListener('touchstart', e => {
            alerts.innerHTML = `<h5></h5>`
        })
        let video = document.createElement('video')
        streamVideo(video, remoteStream)
    });
    */
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        streamVideo(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
}

// Send message
let chat = document.getElementById('chat');

$('html').keydown(e => {
    if (e.keyCode === 13 && chat.value != 0) {
        socket.emit('userChats', chat.value, userName);
        chat.value = '';
    }
})

function sendMessage() {
    if (chat.value != 0) {
        socket.emit('userChats', { chat: chat.value, userName });
        chat.value = '';
    }
}


socket.on('showChats', (chats, userName) => {
    $('#chat-message').append(`<span style="font-size:10px;">${userName}</span></br><li style="font-weight:700">${chats}</li>`)
    scrolltoBottom()
})


function scrolltoBottom() {
    let scroll = $('.chat-body')
    scroll.scrollTop(scroll.prop("scrollHeight"))
}

// Button Function
function muteAndUnmuteAudio() {
    let enabled = myVideoStream.getAudioTracks()[0].enabled

    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        const html = `
        <i class="fas fa-volume-mute font-awsome-style" style="color:red"></i>
                    <span>
                        Unmute
                    </span>
        `
        let mute = document.getElementById("mute")
        mute.innerHTML = html;

    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        const html = `
        <i class="fas fa-volume-off font-awsome-style"></i>
                    <span>
                        Mute
                    </span>
        `
        let mute = document.getElementById("mute")
        mute.innerHTML = html;
    }
}

function muteAndUnmuteVideo() {
    let enabled = myVideoStream.getVideoTracks()[0].enabled

    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        const html = `
        <i class="fas fa-video-slash font-awsome-style" style="color:red"></i>
                    <span>Video
                    </span>
        `
        let mute = document.getElementById("video-mute")
        mute.innerHTML = html;

    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        const html = `
        <i class="fas fa-video font-awsome-style"></i>
                    <span>Video
                    </span>
        `
        let mute = document.getElementById("video-mute")
        mute.innerHTML = html;
    }
}

function showChat() {
    let chat = document.getElementById('left-section')
    let rightPart = document.getElementById('right-section')

    rightPart.style.display = 'none'
    rightPart.style.transition = 'all 1s'
    chat.style.display = 'flex';
    chat.style.width = "100vw";
    chat.style.transition = 'all 1s'

}

function showStreaming() {
    let chat = document.getElementById('left-section')
    let rightPart = document.getElementById('right-section')

    chat.style.display = 'none';
    rightPart.style.display = 'block';

}

// Socket Disconnect
// Leave Meating
let leave_meeting = document.getElementById('leave-button');
leave_meeting.addEventListener('click', (e) => {
    var conf = confirm("Do you want to leave?")
    if (conf) {
        socket.emit('offuser', ROOM_ID, USER_NAME)
        location.href = "/"
    }
})

socket.on('userDisconnectName', (userName) => {
    let alerts = document.getElementById('alerts');
    alerts.innerHTML = `<h5>${userName} Left</h5>`
    $('html').keydown((e) => {
        if (e.keyCode === 13) {
            alerts.innerHTML = `<h5></h5>`
        }
    })
    let body = document.body
    body.addEventListener('touchstart', e => {
        alerts.innerHTML = `<h5></h5>`
    })
})

