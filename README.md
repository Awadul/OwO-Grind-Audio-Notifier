# CustomOWOBot 🤖

An advanced, type-safe Discord automation engine built with **TypeScript** and **Node.js**. Designed as a systems-engineering case study on asynchronous state machines, autonomous scheduler loops, and resilient gateway event handling.

> [!CAUTION]
> **EDUCATIONAL PURPOSE ONLY**
> This repository is developed strictly for educational, research, and learning purposes to study Discord Gateway protocols, TypeScript type-systems, and event-driven architecture. Automating user accounts ("self-botting") violates Discord's Terms of Service. The author assumes no responsibility for any misuse or account restrictions resulting from this software.

---

## 🚀 Key Features

- **⚡ Autonomous Heartbeat Loop:** Decoupled from incoming message events to prevent "broken ping-pong" lockouts; uses an independent clock with randomized human jitter (1–4s) to emulate natural interactions.
- **🚨 Intelligent Captcha Circuit-Breaker:** Multi-pattern detection across both server channels and Direct Messages (DMs). Automatically halts all command dispatching instantly and triggers an audio alarm.
- **💎 Dynamic Gem Selection & Equipping:** 
  - Parses Unicode subscript numbers (`¹`, `²`, `³`) into standard integer quantities.
  - Employs TypeScript **Template Literal Types** (`${GemTier}gem${GemSlot}`) to rank all 21 gem variations.
  - Automatically selects and equips the highest permitted gem while strictly respecting `maxGemTier`.
- **🛡️ Fail-Fast Configuration:** Strong validation boundary on startup guarantees missing `.env` keys halt execution before network initialization.
- **🔊 Local Audio Alert:** Plays emergency alarm audio on captcha appearance to notify the operator immediately.

---

## 📁 Repository Structure

```text
CustomOWOBot/
├── src/
│   ├── assets/
│   │   └── sound/                   # Audio alert files (.mp3)
│   ├── config/
│   │   ├── config.ts                # App configuration & fail-fast env loader
│   │   └── inventory.ts             # Gem ranking metadata & predicates
│   ├── types/
│   │   └── index.ts                 # Type definitions & Template Literal Types
│   ├── utils/
│   │   ├── action.util.ts           # Message type discriminators
│   │   ├── captcha.util.ts          # Pattern-matching captcha detector
│   │   ├── inventory.util.ts        # Unicode parser & gem selection engine
│   │   ├── load_environment.util.ts # Environment variable validator
│   │   ├── sound.util.ts            # Local audio player
│   │   └── timer.util.ts            # Jitter generator & async sleep
│   └── index.ts                     # Main entrypoint & Gateway event listener
├── .env.example                     # Environment template
├── package.json                     # Project manifest & metadata
├── tsconfig.json                    # Strict TypeScript configuration
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/CustomOWOBot.git
   cd CustomOWOBot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and populate your credentials:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```ini
   TOKEN="your_discord_user_token"
   SERVER_ID="your_target_server_id"
   CHANNEL_ID="your_target_channel_id"
   ACCOUNT_ID="your_discord_user_id"
   ```

4. **Verify TypeScript compilation:**
   ```bash
   npm run typecheck
   ```

5. **Start the engine:**
   ```bash
   npm start
   ```

---

## 🎮 Controller Commands

Control the bot directly inside your configured Discord channel from your authorized account (`ACCOUNT_ID`):

| Command | Action | Description |
| :--- | :--- | :--- |
| `start` | **Initialize** | Captures an initial inventory snapshot (`owo inv`) and activates the autonomous hunting loop. |
| `stop` | **Halt** | Gracefully pauses the scheduler and returns status to `idle`. |

---

## ⚙️ Configuration Reference

Customize bot behavior in [src/config/config.ts](file:///d:/CustomOWOBot/src/config/config.ts):

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `soundPlay` | `boolean` | `true` | Enables/disables local MP3 alarm playback on captcha. |
| `maxGemTier` | `GemTier` | `'m'` | Highest gem tier permitted to auto-equip (`'c'`, `'u'`, `'r'`, `'e'`, `'m'`, `'l'`, `'f'`). |
| `enableAutoHunt` | `boolean` | `true` | Automates hunting commands. |
| `enableAutoBattle`| `boolean` | `true` | Automates battle commands. |
| `enableAutoGems` | `boolean` | `true` | Automatically checks and equips depleted gem slots. |

---

## 🖥️ Server Deployment (24/7 Hosting)

When deploying to a remote Linux VPS (e.g., Ubuntu on AWS, DigitalOcean, Hetzner):

1. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

2. **Launch with Process Manager:**
   ```bash
   pm2 start "npx tsx src/index.ts" --name "owobot"
   ```

3. **Monitor logs:**
   ```bash
   pm2 logs owobot
   ```

> [!NOTE]
> On headless cloud servers without physical speakers, disable `soundPlay: false` in `src/config/config.ts` or route alerts to a webhook to avoid unhandled audio driver errors.

---

## 👤 Author

**Muhammad Awais Abdullah (Awadul)**
- **Email:** [awaisabdullahm@gmail.com](mailto:awaisabdullahm@gmail.com)

---

## 📄 License

This project is licensed under the ISC License. See `package.json` for details.
