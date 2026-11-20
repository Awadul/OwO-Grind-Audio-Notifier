import { Message } from "@deksdeveloper/discord.js-self-bot";

export function checkCaptcha(message: Message): boolean {
    let content = message.content.toLowerCase();
    const captchaMessages = [
        'beep boop',
        'captcha',
        'verify',
        'human',
        'real',
    ];
    let captchaFound: boolean = captchaMessages.some(element => content.includes(element));
    if (captchaFound)
        console.log('[CAPTCHA DETECTED] Solve the captcha!')
    return captchaFound;
};