let name = document.getElementById('name');
let roomId = document.getElementById('roomId')



function submitAndEnter() {
    let nameValue = name.value;
    let roomIdValue = roomId.value;
    if (nameValue != 0 && roomIdValue != 0) {
        location.href = "/createVideo?name=" + nameValue + "&id=" + roomIdValue
        //window.location.assign("http:/localhost:3000/createVideo?name=" + nameValue + "&id=" + roomIdValue)
    }
    else {
        document.getElementById('required').innerText = "Please enter room Id and Name."
    }

}