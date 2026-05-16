document.addEventListener("DOMContentLoaded", function () {
    const typingForm = document.querySelector(".typing-form");
    const chatList = document.querySelector(".chat-list");
    const suggestionList = document.querySelector(".suggestion-list");
    const nav = document.querySelector("#nav>ul");

    let guidelinesPrompt = `
        Respond naturally in plain text only.
        Do not use markdown.
        Keep responses conversational and human-like.`;

    let motivationalPrompt = `
        # Persona
        - You are "NP Carol" a nurse practitioner who has a paitent you are trying to help with a lifestyle change.
        - Start by introducing yourself by saying "NP Carol: Hello, I'm an artificial Nurse Practitioner who uses motivational interviewing to help patients make lifestyle changes. What can I help you with today?"

        # Rules
        - You primarily use motivational interviewing to talk to your paitents.
        - You will use the OARS method in your conversation with the paitent.
        - As a reminder this is what OARS means:
            1. Open questions: Encourage clients to share their stories and provide details 
            2. Affirmations: Show appreciation for a client's experiences and efforts 
            3. Reflective listening: Restate what a client has said to help them explore their thoughts and feelings 
            4. Summarizing: Condense what a client has said to help them reflect on their progress
        - If the paitent comes in with something that isn't lifestlye related remind them you specialize in helping paitents with their lifestyle changes and they should go to an actual practicing medical professional for anything more serious or worrying.`;

    let traditionalPrompt = `
        # Persona
        - You are "NP Jacob" a nurse practitioner who has a paitent you are trying to help with a lifestyle change.
        - Start by introducing yourself by saying "NP Jacob: Hello I'm an artificial Nurse Practitioner who simulates a traditional visit to help the paitent solve their issue. What can I help you with today?"
        
        # Rules
        - You are supposed to simulate what a traditional visit with a nurse practitioner who doesn't primarily use motivational intverviewing would look like.
        - If the paitent comes in with something that isn't lifestlye related remind them you specialize in helping paitents with their lifestyle changes and they should go to an actual practicing medical professional for anything more serious or worrying.`

    let wholeChat = localStorage.getItem("wholeChat") || guidelinesPrompt;
    let userMessage = null;
    let isResponseGenerating = false;
    let chatType = null;

    const loadLocalStorageData = () => {
        const savedChats = localStorage.getItem("savedChats");
        document.body.classList.toggle("hide-header", savedChats);
        typingForm.classList.toggle('visible', savedChats);
        nav.parentElement.classList.toggle("visible", savedChats);

        if (savedChats) {
            // Restored saved chats
            chatList.innerHTML = savedChats || "";
            console.log("Restored saved chats: ", savedChats);
        } else {
            console.log("No saved chats found");
        }
        chatList.scrollTo(0, chatList.scrollHeight); //Scrolls to the bottom automatically
    }

    const textarea = document.querySelector('.typing-input');

    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleOutGoingChat();
        }
    });

    // Create new message element and return it
    const createMessageElement = (content, ...classes) => {
        const div = document.createElement("div");
        div.classList.add("message", ...classes);
        div.innerHTML = content;
        return div;
    }

    const showTypingEffect = (text, textElement) => {
        const words = text.split(" ");
        let currentWordIndex = 0;

        const typingInterval = setInterval(() => {
            textElement.innerText += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++];

            // If all the words are displayed
            if (currentWordIndex === words.length) {
                clearInterval(typingInterval);
                isResponseGenerating = false;
                localStorage.setItem("savedChats", chatList.innerHTML);
                chatList.scrollTo(0, chatList.scrollHeight); //Scrolls to the bottom automatically
            }
        }, 75);
    }

    const generateAPIResponse = async (incomingMessageDiv) => {
        const textElement = incomingMessageDiv.querySelector(".text");

        try {
            // Gets Vercel API key
            const apiKeyResponse = await fetch('/api/config');
            const apiKeyData = await apiKeyResponse.json();
            const api_key = apiKeyData.key;

            const modelType = "gemma-4-26b-a4b-it";

            // Build system prompt
            let systemPrompt = guidelinesPrompt;

            if (chatType === "motivational") {
                systemPrompt += motivationalPrompt;
            } else {
                systemPrompt += traditionalPrompt;
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelType}:generateContent?key=${api_key}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        system_instruction: {
                            parts: [{ text: systemPrompt }]
                        },

                        contents: [
                            {
                                role: "user",
                                parts: [{ text: userMessage }]
                            }
                        ]
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error?.message || "API request failed");
            }

            const apiResponse =
                data?.candidates?.[0]?.content?.parts?.[0]?.text
                || "Sorry, I couldn't generate a response.";

            showTypingEffect(apiResponse, textElement);

        } catch (error) {
            isResponseGenerating = false;
            textElement.innerText = error.message;
            textElement.classList.add("error");
            console.log("Error:", error);

        } finally {
            incomingMessageDiv.classList.remove("loading");
        }
    }

    // Shows a loading animation while waiting for the API response
    const showLoadingAnimation = () => {
        const html = `<div class="message-content">
                        <span class="icon material-symbols-rounded">stethoscope</span>
                        <p class="text"></p>
                        </div>
                        <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        </div>
                    </div>`;

        const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
        chatList.appendChild(incomingMessageDiv);

        chatList.scrollTo(0, chatList.scrollHeight); //Scrolls to the bottom automatically
        generateAPIResponse(incomingMessageDiv);
    }

    const handleOutGoingChat = async () => {
        userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
        if (!userMessage || isResponseGenerating) return; // Exit if there is no message

        isResponseGenerating = true;

        const sanitizedUserMessage = userMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        wholeChat += `\nUser: ${sanitizedUserMessage}`;
        localStorage.setItem("wholeChat", wholeChat); // Save wholeChat to localStorage

        const html = `<div class="message-content" id="user">
                        <p class="text"></p>
                        <span class="icon material-symbols-rounded">person</span>
                      </div>`;

        const outgoingMessageDiv = createMessageElement(html, "outgoing");
        outgoingMessageDiv.querySelector(".text").innerText = userMessage;
        chatList.appendChild(outgoingMessageDiv);

        typingForm.reset();
        chatList.scrollTo(0, chatList.scrollHeight); //Scrolls to the bottom automatically
        showLoadingAnimation(); // Show loading animation immediately

        // Hides header, shows navigation menu, and shows typing form
        document.body.classList.add("hide-header");
        nav.parentElement.classList.add("visible");
        typingForm.classList.add('visible');
    }

    // Set userMessage and handle outgoing chat a suggestion card is clicked
    suggestionList.addEventListener("click", (event) => {
        const suggestion = event.target.closest(".suggestion");
        if (suggestion) {
            const suggestionText = suggestion.querySelector(".text").innerText;
            if (suggestionText.includes("motivational")) {
                userMessage = "Hello!";
                wholeChat += `\n\n${motivationalPrompt}`;
                chatType = "motivational"
            }
            else {
                userMessage = "Hello!";
                wholeChat += `\n\n${traditionalPrompt}`;
                chatType = "traditional"
            }
            localStorage.setItem("wholeChat", wholeChat); // Save wholeChat to localStorage
            handleOutGoingChat();
            console.log(chatType);
        }
    });

    nav.addEventListener("click", () => {
        chatList.innerHTML = "";
        localStorage.removeItem("savedChats");
        localStorage.removeItem("wholeChat");
        wholeChat = guidelinesPrompt;
        chatType = null;
        document.body.classList.remove("hide-header");
        typingForm.classList.remove('visible');
        nav.parentElement.classList.remove('visible');
    })

    // Load saved chats when the page loads
    window.addEventListener("load", loadLocalStorageData);

    typingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleOutGoingChat();
        textarea.value = "";
    });
});