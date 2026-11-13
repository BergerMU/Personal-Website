// Fade in/out page elements
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Update Current User Count
function updateCount(everyone) {
    const count = everyone.length;
    document.querySelector("#online_count").textContent = `${count} ${count === 1 ? "person" : "people"} online`;
}

// Send Message Function + Event Listener
function SendChatMessage(user_name) {
    // Get Valid Input
    const message_input_element = document.getElementById("message_input");
    if (!message_input_element.value) return;

    // Truncate Chat History Over 20 Messages
    if (document.querySelectorAll("#chat_entry").length >= 20) {
        const entries = document.querySelectorAll("#chat_entry");
        entries.item(0).remove();
    }

    // Create Parent Chat Entry Element
    const chat_entry_element = document.createElement("div");
    chat_entry_element.id = "chat_entry";

    // Create Child Chat Message + Time Elements
    const chat_messages_element = document.createElement("div");
    chat_messages_element.id = "chat_messages";
    const chat_times_element = document.createElement("div");
    chat_times_element.id = "chat_times";

    // Create Child-Child Message + Time Elements
    const message = document.createElement("p");
    message.textContent = message_input_element.value;
    chat_messages_element.append(message);

    const time = document.createElement("p");
    time.textContent = `${user_name} | ${new Date().toLocaleTimeString()}`;
    chat_times_element.append(time);

    // Add Parent Chat Entry Element To Page + Clear Input
    chat_entry_element.append(chat_times_element, chat_messages_element);
    document.getElementById("chat_message_history").append(chat_entry_element);
    message_input_element.value = "";
    chat_entry_element.scrollIntoView({ behavior: "smooth", block: "end" });
};

// Open/Close Chat Function + Event Listener
function OpenCloseChat() {
    if (document.getElementById("chat_container").className == 'chat_hidden') {
        document.getElementById("chat_container").className = 'chat_show';
        document.getElementById("open_close_chat").textContent = "collapse_content";

        document.getElementById("chat_message_history").scrollTop = document.getElementById("chat_message_history").scrollHeight;
    } else {
        document.getElementById("chat_container").className = 'chat_hidden';
        document.getElementById("open_close_chat").textContent = "expand_content";
    };
};

function GenerateName() {
    var adjective = ["Excited", "Anxious", "Overweight", "Demonic", "Jumpy", "Misunderstood", "Squashed", "Gargantuan", "Broad", "Crooked", "Curved", "Deep", "Even", "Excited", "Anxious", "Overweight", "Demonic", "Jumpy", "Misunderstood", "Squashed", "Gargantuan", "Broad", "Crooked", "Curved", "Deep", "Even", "Flat", "Hilly", "Jagged", "Round", "Shallow", "Square", "Steep", "Straight", "Thick", "Thin", "Cooing", "Deafening", "Faint", "Harsh", "High-pitched", "Hissing", "Hushed", "Husky", "Loud", "Melodic", "Moaning", "Mute", "Noisy", "Purring", "Quiet", "Raspy", "Screeching", "Shrill", "Silent", "Soft", "Squeaky", "Squealing", "Thundering", "Voiceless", "Whispering"];
    var object = ["Taco", "Operating System", "Sphere", "Watermelon", "Cheeseburger", "Apple Pie", "Spider", "Dragon", "Remote Control", "Soda", "Barbie Doll", "Watch", "Purple Pen", "Dollar Bill", "Stuffed Animal", "Hair Clip", "Sunglasses", "T-shirt", "Purse", "Towel", "Hat", "Camera", "Hand Sanitizer Bottle", "Photo", "Dog Bone", "Hair Brush", "Birthday Card"];

    return adjective[Math.floor(Math.random() * adjective.length)] + " " + object[Math.floor(Math.random() * object.length)];
}