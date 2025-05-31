(function () {

    console.group("Synthwave Dark ::: GLOW JS");

    //====================================
    // Theme replacement CSS (Glow styles)
    //====================================
    const tokenReplacements: Record<string, string> = {
        /* pink */
        'f92672': "color: #F92672; text-shadow: 0 0 10px #F9267280, 0 0 20px #F9267260, 0 0 30px #F9267240, 0 0 40px #F9267220;",

    };

    const themeStylesExist = (tokensEl: HTMLElement, replacements: Record<string, string>): boolean => {
        console.log("Checking if theme styles exist...");
        const result = tokensEl.innerText !== '' &&
            Object.keys(replacements).every(color => {
                const includesColor = tokensEl.innerText.toLowerCase().includes(`#${color}`);
                console.log(`Checking color #${color}: ${includesColor}`);
                return includesColor;
            });
        console.log("Theme styles exist:", result);
        return result;
    };

    const replaceTokens = (styles: string, replacements: Record<string, string>): string =>
        Object.keys(replacements).reduce((acc, color) => {
            const re = new RegExp(`color: #${color};`, 'gi');
            return acc.replace(re, replacements[color]);
        }, styles);

    const usingSynthwave = (): boolean => {
        const appliedTheme = document.querySelector('[class*="theme-json"]');
        const synthWaveTheme = document.querySelector('[class*="SammyKumar-synthwave-dark-vscode-themes"]');
        const result = !!(appliedTheme && synthWaveTheme);
        console.log("Using Dark Synthwave theme:", result);
        return result;
    };

    const readyForReplacement = (tokensEl: HTMLElement | null, tokenReplacements: Record<string, string>): boolean => tokensEl
        ? (
            usingSynthwave() &&
            themeStylesExist(tokensEl, tokenReplacements)
        )
        : false;

    const initNeonDreams = (obs: MutationObserver | null): void => {
        console.log("Initializing Neon Dreams...");
        const tokensEl = document.querySelector('.vscode-tokens-styles') as HTMLElement;

        if (!tokensEl || !readyForReplacement(tokensEl, tokenReplacements)) {
            console.log("Tokens element not ready or not found.");
            return;
        }

        if (!document.querySelector('#synthwave-84-theme-styles')) {
            const initialThemeStyles = tokensEl.innerText;
            console.log("Initial theme styles captured.");

            let updatedThemeStyles = replaceTokens(initialThemeStyles, tokenReplacements);

            updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`;

            const newStyleTag = document.createElement('style');
            newStyleTag.setAttribute("id", "synthwave-84-theme-styles");
            newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');
            document.body.appendChild(newStyleTag);

            console.log('Synthwave Dark: Glow initialised!');
        } else {
            console.log("Glow styles already applied.");
        }

        if (obs) {
            console.log("Disconnecting observer.");
            obs.disconnect();
            obs = null;
        }
    };

    const watchForBootstrap = function (mutationsList: MutationRecord[], observer: MutationObserver): void {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' || mutation.type === 'childList') {
                const tokensEl = document.querySelector('.vscode-tokens-styles') as HTMLElement;
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

    window.addEventListener('DOMContentLoaded', () => {
        const bodyNode = document.querySelector('body') as HTMLElement;
        const observer = new MutationObserver(watchForBootstrap);
        observer.observe(bodyNode, { attributes: true, childList: true });
    });

    console.groupEnd();
})();