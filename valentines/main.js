const container = document.querySelector(".button-container");
const containerRect = container.getBoundingClientRect();
const noBox = document.getElementById("no");
const yesBox = document.getElementById("yes");
const headerElement = document.querySelector(".header h1");

const message = [
    "wait why did u try to click no?",
    "babe i think you missclicked...",
    "oh hehe you missclicked again that's so silly!",
    "oh wow four times... that's okay this is like aim training for you",
    "babe this is starting to feel like it's on purpose",
    "babe please why are you doing this",
    "NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    "this doesn't make any sense",
    "u r a freaking weirdo D:",
    "what the gyatt is going on",
    "babe PLEASE I don't have a backup plan for valentines day",
    "omg",
    "i'm so sad right now :(",
    "i'm actually gonna cry",
    "how are u finding these now",
    "man u are dedicated",
    "pls",
    "it's not too late to click yes",
    "you can stop any time now",
    "please",
    "actually how did you find this one? Like this is impressive",
    "jeez holy moly",
    "your eyesight is better than mine i swear",
    "how good is ur eyesight like jeez",
    "i'm gonna tell your mom u said no",
    "she's gonna ground you",
    "PLEASE STOP",
    "PRESS YES PLEASE",
    "holy shit",
    "dayum",
    "DAYUM",
    "okay i'm gonna stop typing more messages now",
    "why did you continue?",
    "okay this is the last message so u can stop now",
    "okay this is actually the last message for real",
    "this has to be some type of crime",
    "SHE HATES ME",
    "i'm putting this in some type of folder",
    "better luck next year i guess",
    "ඞ",
    "this is the 40th time you've clicked babe what da",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",
    "okay no more",];

let index = 0;
let scale = 1;

noBox.addEventListener("click", (event) => {
    const clickX = event.clientX - containerRect.left;
    const clickY = event.clientY - containerRect.top;

    // text element after button is clicked
    const sadText = document.createElement("h1");
    sadText.textContent = message[index];
    sadText.style.position = "absolute";
    sadText.style.top = `${clickY}px`;
    sadText.style.left = `${clickX}px`;
    sadText.style.width = "18vw";
    sadText.style.textAlign = "center";
    sadText.style.transform = "translate(-50%, -50%)";
    sadText.className = "click-message";
    sadText.style.fontSize = "calc(15px + 1.5vw)";
    sadText.style.color = "white";
    sadText.style.webkitTextStrokeWidth = "1px";
    sadText.style.webkitTextStrokeColor = "black";
    sadText.style.transition = "opacity 1s ease";
    container.appendChild(sadText);
    index += 1;

    // Trigger the transition
    requestAnimationFrame(() => {
        sadText.style.opacity = "1";
    });

    setTimeout(() => {
        sadText.style.opacity = "0";
        setTimeout(() => {
            sadText.remove();
        }, 500);
    }, 3000);

    // make the no button disappear and reappear
    noBox.style.transition = "all 0.5s ease";
    noBox.style.opacity = "0";
    setTimeout(() => {
        scale *= 0.85;

        const newWidth = 100 * scale;
        const newHeight = 100 * scale;
        const newFontSize = 25 * scale;

        let randY = Math.random() * (containerRect.height - newHeight);
        let randX = Math.random() * (containerRect.width - newWidth);

        noBox.style.top = `${randY}px`;
        noBox.style.left = `${randX}px`;

        noBox.style.width = `${newWidth}px`;
        noBox.style.height = `${newHeight}px`;
        noBox.style.fontSize = `${newFontSize}px`;

        setTimeout(() => {
            noBox.style.opacity = "1";
        }, 500);
        noBox.style.position = "absolute";
    }, 1000);
});

yesBox.addEventListener("click", () => {
    noBox.style.transition = "all 0.5s ease";
    yesBox.style.transition = "all 0.5s ease";
    noBox.style.opacity = "0";
    yesBox.style.opacity = "0";

    setTimeout(() => {
        yesBox.remove();
        noBox.remove();
    }, 300);

    headerElement.innerText.transition = "all 1s ease";
    headerElement.innerText = "YAY YA YA YAY";

    // Creating the images
    const img = document.createElement("img");
    img.src = "images/hugging_1.gif";
    img.id = "hug_1";
    document.body.appendChild(img);

    const img2 = document.createElement("img");
    img2.src = "images/hugging_2.gif";
    img2.id = "hug_2";
    document.body.appendChild(img2);

    const img3 = document.createElement("img");
    img3.src = "images/iloveu.gif";
    img3.id = "iloveu";
    document.body.appendChild(img3);

    const img4 = document.createElement("img");
    img4.src = "images/pusheen.gif";
    img4.id = "push";
    document.body.appendChild(img4);

    const img5 = document.createElement("img");
    img5.src = "images/chococat_1.gif";
    img5.id = "choco";
    document.body.appendChild(img5);
});