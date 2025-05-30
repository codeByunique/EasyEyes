// Text bada karo
document.getElementById("increaseText").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, a, li, td, div").forEach(el => {
          const size = window.getComputedStyle(el).fontSize;
          el.style.fontSize = (parseFloat(size) + 2) + "px";
        });
      }
    });
  });
});

// Text aur language reset (original me lao)
document.getElementById("resetText").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        document.querySelectorAll("[data-original-text]").forEach(el => {
          el.innerHTML = el.getAttribute("data-original-text");
          el.removeAttribute("data-original-text");
        });
        document.querySelectorAll("*").forEach(el => {
          el.style.fontSize = "";
        });
      }
    });
  });
});

// Translate selected text with formatting preserved
document.getElementById("translateSelected").addEventListener("click", () => {
  const lang = document.getElementById("language").value;

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: async (lang) => {
        const selection = window.getSelection();
        if (selection.isCollapsed) {
          alert("Koi text select karo pehle.");
          return;
        }

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const elements = [];

        let parent = container.nodeType === 1 ? container : container.parentElement;

        parent.querySelectorAll("*").forEach(el => {
          if (selection.containsNode(el, true)) {
            elements.push(el);
          }
        });

        for (const el of elements) {
          const originalText = el.innerText.trim();
          if (!originalText) continue;

          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(originalText)}`);
          const data = await res.json();
          const translated = data[0].map(item => item[0]).join('');

          el.setAttribute("data-original-text", el.innerHTML);
          el.innerText = translated;
        }
      },
      args: [lang]
    });
  });
});

// Sirf selected text padho
document.getElementById("readSelected").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        const text = window.getSelection().toString();
        if (!text) {
          alert("Koi text select karo pehle.");
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
    });
  });
});

// Stop speech
document.getElementById("stopSpeech").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        speechSynthesis.cancel();
      }
    });
  });
});
