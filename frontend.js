$(function () {
    "use strict";

    var content = $("#content");
    var input = document.getElementById("input");
    var status = document.getElementById("status");
    var myName = false;
    var json;
    var connection = new WebSocket("ws://test.earnerschannel.ml:1337");

    connection.onopen = function () {
        input.removeAttribute("disabled");
        status.innerText = "Enter your username:";
    };
    connection.onerror = function (error) {
        console.log(error);
    };
    connection.onmessage = function (message) {
        try {

            json = JSON.parse(message.data);

        } catch (e) {
            console.log("Invalid message");
            return;
        }
        if (json.type === "username") {
            input.removeAttribute("disabled");
            status.innerText = myName + ':';
        }
        else if (json.type === "history") {
            console.log(json.data);
            for (var i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text, new Date(json.data[i].dat),"true");

            }


        } else if (json.type === "message") {
            input.removeAttribute("disabled");
            addMessage(json.data.author, json.data.text, new Date(json.data.dat),"false");
        }





    };
    $("#input").keydown(function (e) {

        if (e.which == 13) {
            var msg = $(this).val();

            if (!msg) {
                return;
            }
            connection.send(msg);
            $(this).val("");
            input.setAttribute("disabled", "disabled");
            if (myName === false) {
                myName = msg;

            } else {

            }
        }

    });

    setInterval(function () {
        if (connection.readyState !== 1) {

            input.setAttribute('disabled', 'disabled')
            status.innerHTML =
                'Unable to communicate with the WebSocket server.';
        }
    }, 3000);

    function addMessage(author, message, dt,history) {

        if (author === myName) {
            content.append('<span style="color:blue;">' + author + ': ' + message + '<span><br><span>' + dt + '</span><br>');

        } else if (history) {
            content.append('<span style="color:red;">' + author + ': ' + message + '<span><br><span>' + dt + '</span><br>');

        }
        else {
            content.append('<span style="color:black;">' + author + ': ' + message + '<span><br><span>' + dt + '</span><br>');

        }
    }
});



