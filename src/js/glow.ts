(function () {
  console.group("Synthwave Dark ::: GLOW JS");

  //====================================
  // Theme replacement CSS (Glow styles)
  //====================================
  const tokenReplacements: Record<string, string> = {
    /* pink */
    f92672:
      "color: #f92672; text-shadow: 0 0 10px #F9267280, 0 0 20px #F9267260, 0 0 30px #F9267240, 0 0 40px #F9267220;",
    /* yellow */
    e6db74:
      "color: #e6db74; text-shadow: 0 0 10px #E6DB7480, 0 0 20px #E6DB7460, 0 0 30px #E6DB7440, 0 0 40px #E6DB7420;",
    /* blue */
    "66d9ef":
      "color: #66d9ef; text-shadow: 0 0 10px #66D9EF80, 0 0 20px #66D9EF60, 0 0 30px #66D9EF40, 0 0 40px #66D9EF20;",
    /* purple */
    ae81ff:
      "color: #ae81ff; text-shadow: 0 0 10px #AE81FF80, 0 0 20px #AE81FF60, 0 0 30px #AE81FF40, 0 0 40px #AE81FF20;",
    /* apple intelligence */
    fc0303:
      "background: linear-gradient(108deg, #0894FF, #C959DD 34%, #FF2E54 68%, #FF9004); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; text-shadow: 0 0 20px rgba(255, 144, 4, 0.4), 0 0 16px rgba(255, 46, 84, 0.4), 0 0 12px rgba(201, 89, 221, 0.4), 0 0 8px rgba(8, 148, 255, 0.6);",
  };

  const themeStylesExist = (
    tokensEl: HTMLElement,
    replacements: Record<string, string>
  ): boolean => {
    console.log("Checking if theme styles exist...");
    const result =
      tokensEl.innerText !== "" &&
      Object.keys(replacements).every((color) => {
        const includesColor = tokensEl.innerText
          .toLowerCase()
          .includes(`#${color}`);
        console.log(`Checking color #${color}: ${includesColor}`);
        return includesColor;
      });
    console.log("Theme styles exist:", result);
    return result;
  };

  const replaceTokens = (
    styles: string,
    replacements: Record<string, string>
  ): string =>
    Object.keys(replacements).reduce((acc, color) => {
      const re = new RegExp(`color: #${color};`, "gi");
      return acc.replace(re, replacements[color]);
    }, styles);

  const usingSynthwave = (): boolean => {
    const appliedTheme = document.querySelector('[class*="theme-json"]');
    const synthWaveTheme = document.querySelector(
      '[class*="SammyKumar-synthwave-dark-vscode-themes"]'
    );
    const result = !!(appliedTheme && synthWaveTheme);
    console.log("Using Dark Synthwave theme:", result);
    return result;
  };

  const readyForReplacement = (
    tokensEl: HTMLElement | null,
    tokenReplacements: Record<string, string>
  ): boolean =>
    tokensEl
      ? usingSynthwave() && themeStylesExist(tokensEl, tokenReplacements)
      : false;

  const initNeonDreams = (obs: MutationObserver | null): void => {
    console.log("Initializing Neon Dreams...");
    const tokensEl = document.querySelector(
      ".vscode-tokens-styles"
    ) as HTMLElement;

    if (!tokensEl || !readyForReplacement(tokensEl, tokenReplacements)) {
      console.log("Tokens element not ready or not found.");
      return;
    }

    if (!document.querySelector("#synthwave-84-theme-styles")) {
      const initialThemeStyles = tokensEl.innerText;
      console.log("Initial theme styles captured.");

      let updatedThemeStyles = replaceTokens(
        initialThemeStyles,
        tokenReplacements
      );

      updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`;

      const newStyleTag = document.createElement("style");
      newStyleTag.setAttribute("id", "synthwave-84-theme-styles");
      newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, "");
      document.body.appendChild(newStyleTag);

      console.log("Synthwave Dark: Glow initialised!");
    } else {
      console.log("Glow styles already applied.");
    }

    if (obs) {
      console.log("Disconnecting observer.");
      obs.disconnect();
      obs = null;
    }
  };

  const watchForBootstrap = function (
    mutationsList: MutationRecord[],
    observer: MutationObserver
  ): void {
    for (let mutation of mutationsList) {
      if (mutation.type === "attributes" || mutation.type === "childList") {
        const tokensEl = document.querySelector(
          ".vscode-tokens-styles"
        ) as HTMLElement;
        if (readyForReplacement(tokensEl, tokenReplacements)) {
          initNeonDreams(observer);
        } else {
          if (tokensEl) {
            observer.disconnect();
            observer.observe(tokensEl, { childList: true });
          }
        }
      }
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    const bodyNode = document.querySelector("body") as HTMLElement;
    const observer = new MutationObserver(watchForBootstrap);
    observer.observe(bodyNode, { attributes: true, childList: true });
  });

  console.groupEnd();
})();
