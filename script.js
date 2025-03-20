//登錄等待動畫
window.onload = function() 
{
    setTimeout(() => 
    {
        document.querySelector('.loading-screen').classList.add('hidden');
        document.body.style.overflow = 'auto'; // 允許滾動
    }, 1000); // 1 秒後隱藏動畫

    window.addEventListener("load", function () 
    {
        document.querySelector(".loading-screen").classList.add("hidden");
    });
};

//書籤式選單和漢堡選單
document.addEventListener('DOMContentLoaded', function () 
{
    const navbarNavLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navbarNavLinks.forEach(function (navLink) 
    {
        navLink.addEventListener('click', function (event) 
        {
            event.preventDefault(); // 防止預設連結行為

            const targetTabId = this.getAttribute('href'); // 取得目標 Tab ID (例如，#home)
            const targetTab = document.querySelector(`[data-bs-toggle="tab"][href="${targetTabId}"]`); // 尋找 Tab 連結

            if (targetTab) 
            {
                const bsTab = bootstrap.Tab.getInstance(targetTab);  // 取得 Bootstrap Tab 實例 (如果存在)

                if (bsTab) // 如果 Tab 實例存在，呼叫 show 方法
                {
                    bsTab.show();
                } 

                else // 如果 Tab 實例不存在，建立新的實例並顯示它
                {
                    new bootstrap.Tab(targetTab).show();
                }

                const navbarCollapse = document.querySelector('#navbarNav');  // 關閉漢堡選單 (可選)
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) 
                {
                    bsCollapse.hide();
                }
            }
        });
    });
});

//響應式網頁設定
document.addEventListener('DOMContentLoaded', function () 
{
    const navbarCollapse = document.querySelector('#navbarNav');
    const display1 = document.querySelector('.display1');
    const display2 = document.querySelector('.display2');
    const originalTop1 = parseInt(window.getComputedStyle(display1).top);
    const originalTop2 = parseInt(window.getComputedStyle(display2).top);
    const offset = 150; // 設定偏移量 (你可以調整這個值)

    navbarCollapse.addEventListener('show.bs.collapse', function () 
    {
        display1.style.top = (originalTop1 + offset) + 'px';
        display2.style.top = (originalTop2 + offset) + 'px';
    });

    navbarCollapse.addEventListener('hide.bs.collapse', function () 
    {
        display1.style.top = originalTop1 + 'px';
        display2.style.top = originalTop2 + 'px';
    });
});

//大語言模型
let key = "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"

async function groqChat(q) {
    const jsonResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        body: JSON.stringify({
            "model": "llama3-8b-8192",
            "messages": [{"role": "user", "content": q}],
            "temperature": 0.7
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
        }
    });

    const jsonData = await jsonResponse.json();
    console.log(JSON.stringify(jsonData, null, 2));
    return jsonData.choices[0].message.content;
}

async function chat() {
    let qNode = document.querySelector('#question');
    let chatBox = document.getElementById("chatBox");
    let userMessage = qNode.value.trim();

    if (userMessage === "") return;

    // 用戶名稱
    let userLabel = document.createElement("div");
    userLabel.classList.add("user-label");
    userLabel.innerText = "你";

    // 用戶訊息
    let userDiv = document.createElement("div");
    userDiv.classList.add("message", "user-message", "p-2");
    userDiv.innerHTML = userMessage.replace(/\n/g, "<br>");

    let userContainer = document.createElement("div");
    userContainer.classList.add("message-container");
    userContainer.appendChild(userLabel);
    userContainer.appendChild(userDiv);

    chatBox.appendChild(userContainer);

    // 清空輸入框
    qNode.value = "";

    // 機器人回覆 (先顯示等待)
    let botLabel = document.createElement("div");
    botLabel.classList.add("bot-label");
    botLabel.innerText = "Groq";

    let botDiv = document.createElement("div");
    botDiv.classList.add("message", "bot-message", "p-2");
    botDiv.innerHTML = "請稍等幾秒鐘 ...";

    let botContainer = document.createElement("div");
    botContainer.classList.add("message-container");
    botContainer.appendChild(botLabel);
    botContainer.appendChild(botDiv);

    chatBox.appendChild(botContainer);

    chatBox.scrollTop = chatBox.scrollHeight;

    // 呼叫 API
    let answer = await groqChat(userMessage);
    botDiv.innerHTML = answer.replace(/\n/g, "<br>");

    // 自動滾動到底部
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 支援 Shift+Enter 換行，Enter 送出
document.getElementById("question").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        if (event.shiftKey) {
            event.preventDefault();
            let cursorPos = this.selectionStart;
            this.value = this.value.substring(0, cursorPos) + "\n" + this.value.substring(cursorPos);
            this.selectionStart = this.selectionEnd = cursorPos + 1;
        } else {
            event.preventDefault();
            chat();
        }
    }
});