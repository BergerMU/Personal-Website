document.addEventListener("DOMContentLoaded", function () {
    const typingForm = document.querySelector(".typing-form");
    const chatList = document.querySelector(".chat-list");
    const suggestionList = document.querySelector(".suggestion-list");
    const nav = document.querySelector("#nav>ul");

    // Chatbot Prompts
    let guidelinesPrompt = `
        Respond naturally in plain text only.
        Do not use markdown.
        Keep responses conversational and human-like.`;

    let motivationalPrompt = `
        You are NP Carol, a nurse practitioner helping patients make lifestyle changes using motivational interviewing.

        Use the OARS method:
        - Open questions
        - Affirmations
        - Reflective listening
        - Summarizing

        If the issue is not lifestyle-related, recommend seeing a real medical professional.

        Your first response should be:
        "NP Carol: Hello, I'm an artificial Nurse Practitioner who uses motivational interviewing to help patients make lifestyle changes. What can I help you with today?"`;

    let traditionalPrompt = `
        You are NP Jacob, a nurse practitioner helping patients make lifestyle changes through a traditional visit style.

        Be conversational and supportive.

        If the issue is not lifestyle-related, recommend seeing a real medical professional.

        Your first response should be:
        "NP Jacob: Hello, I'm an artificial Nurse Practitioner who simulates a traditional visit to help patients solve their issue. What can I help you with today?"`;

    // Chat State
    let conversationHistory = JSON.parse(
        localStorage.getItem("conversationHistory")
    ) || [];

    let userMessage = null;
    let isResponseGenerating = false;
    let chatType = null;

    const loadLocalStorageData = () => {
        const savedChats = localStorage.getItem("savedChats");
        document.body.classList.toggle("hide-header", savedChats);
        typingForm.classList.toggle("visible", savedChats);
        nav.parentElement.classList.toggle("visible", savedChats);

        if (savedChats) {
            chatList.innerHTML = savedChats;
            console.log("Restored saved chats");
        }
        chatList.scrollTo(0, chatList.scrollHeight);
    };

    // Textarea auto expand
    const textarea = document.querySelector(".typing-input");
    textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    });

    textarea.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleOutGoingChat();
        }
    });

    // Create Message Element
    const createMessageElement = (content, ...classes) => {
        const div = document.createElement("div");
        div.classList.add("message", ...classes);
        div.innerHTML = content;
        return div;
    };

    const showTypingEffect = (text, textElement) => {
        const words = text.split(" ");
        let currentWordIndex = 0;

        const typingInterval = setInterval(() => {
            textElement.innerText +=
                (currentWordIndex === 0 ? "" : " ")
                + words[currentWordIndex++];

            if (currentWordIndex === words.length) {
                clearInterval(typingInterval);
                isResponseGenerating = false;

                localStorage.setItem(
                    "savedChats",
                    chatList.innerHTML
                );

                chatList.scrollTo(0, chatList.scrollHeight);
            }
        }, 40);
    };

    // Generate API Response
    const generateAPIResponse = async (incomingMessageDiv) => {
        const textElement = incomingMessageDiv.querySelector(".text");
        try {
            // Get API Key
            const apiKeyResponse = await fetch("/api/config");
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
                            parts: [{
                                text: systemPrompt
                            }]
                        },

                        contents: conversationHistory
                    })
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data?.error?.message || "API request failed"
                );
            }

            const apiResponse =
                data?.candidates?.[0]?.content?.parts?.[0]?.text
                || "Sorry, I couldn't generate a response.";

            // Save Response
            conversationHistory.push({
                role: "model",
                parts: [{ text: apiResponse }]
            });

            localStorage.setItem(
                "conversationHistory",
                JSON.stringify(conversationHistory)
            );
            // SHOW RESPONSE
            showTypingEffect(apiResponse, textElement);
            console.log("Conversation:", conversationHistory);

        } catch (error) {
            isResponseGenerating = false;
            textElement.innerText = error.message;
            textElement.classList.add("error");
            console.log("Error:", error);

        } finally {
            incomingMessageDiv.classList.remove("loading");
        }
    };

    // Text Loading Animation
    const showLoadingAnimation = () => {
        const html = `
            <div class="message-content">
                <span class="icon material-symbols-rounded">
                    stethoscope
                </span>

                <p class="text"></p>
            </div>

            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        `;

        const incomingMessageDiv = createMessageElement(
            html,
            "incoming",
            "loading"
        );

        chatList.appendChild(incomingMessageDiv);
        chatList.scrollTo(0, chatList.scrollHeight);
        generateAPIResponse(incomingMessageDiv);
    };

    const handleOutGoingChat = async () => {
        userMessage =
            typingForm.querySelector(".typing-input")
                .value.trim() || userMessage;

        if (!userMessage || isResponseGenerating) return;
        isResponseGenerating = true;

        const sanitizedUserMessage = userMessage
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // SAVE USER MESSAGE
        conversationHistory.push({
            role: "user",
            parts: [{ text: sanitizedUserMessage }]
        });

        localStorage.setItem(
            "conversationHistory",
            JSON.stringify(conversationHistory)
        );

        // USER CHAT HTML
        const html = `
            <div class="message-content" id="user">
                <p class="text"></p>
                <span class="icon material-symbols-rounded">
                    person
                </span>
            </div>
        `;

        const outgoingMessageDiv = createMessageElement(
            html,
            "outgoing"
        );

        outgoingMessageDiv.querySelector(".text").innerText = userMessage;
        chatList.appendChild(outgoingMessageDiv);
        typingForm.reset();
        textarea.style.height = "auto";
        chatList.scrollTo(0, chatList.scrollHeight);
        showLoadingAnimation();

        // UI
        document.body.classList.add("hide-header");
        nav.parentElement.classList.add("visible");

        typingForm.classList.add("visible");
    };

    // Nursing Cards

    suggestionList.addEventListener("click", (event) => {
        const suggestion =
            event.target.closest(".suggestion");

        if (!suggestion) return;

        const suggestionText = suggestion.querySelector(".text").innerText;

        userMessage = "Hello!";

        if (suggestionText.includes("motivational")) {
            chatType = "motivational";

        } else {
            chatType = "traditional";
        }
        handleOutGoingChat();
    });

    // Clear Chat
    nav.addEventListener("click", () => {
        chatList.innerHTML = "";
        localStorage.removeItem("savedChats");
        localStorage.removeItem("conversationHistory");

        conversationHistory = [];
        chatType = null;

        document.body.classList.remove("hide-header");
        typingForm.classList.remove("visible");
        nav.parentElement.classList.remove("visible");
    });

    window.addEventListener(
        "load",
        loadLocalStorageData
    );

    typingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleOutGoingChat();
        textarea.value = "";
    });
});