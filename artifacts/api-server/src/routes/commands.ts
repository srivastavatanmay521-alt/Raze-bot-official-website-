import { Router, type IRouter } from "express";
import { GetCommandsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const commandData = [
  {
    category: "Moderation",
    icon: "shield",
    commands: [
      { name: "/ban", description: "Ban a member from the server", usage: "/ban @user [reason]" },
      { name: "/kick", description: "Kick a member from the server", usage: "/kick @user [reason]" },
      { name: "/mute", description: "Timeout a member for a duration", usage: "/mute @user <duration> [reason]" },
      { name: "/purge", description: "Bulk delete messages in a channel", usage: "/purge <amount>" },
      { name: "/warn", description: "Issue a warning to a member", usage: "/warn @user <reason>" },
      { name: "/slowmode", description: "Set slowmode for a channel", usage: "/slowmode <seconds>" },
    ],
  },
  {
    category: "Leveling",
    icon: "trending-up",
    commands: [
      { name: "/rank", description: "View your or another user's rank card", usage: "/rank [@user]" },
      { name: "/leaderboard", description: "Show the server XP leaderboard", usage: "/leaderboard" },
      { name: "/setxp", description: "Set XP for a user (admin only)", usage: "/setxp @user <amount>" },
      { name: "/resetxp", description: "Reset a user's XP (admin only)", usage: "/resetxp @user" },
    ],
  },
  {
    category: "Economy",
    icon: "coins",
    commands: [
      { name: "/balance", description: "Check your coin balance", usage: "/balance [@user]" },
      { name: "/daily", description: "Claim your daily coins", usage: "/daily" },
      { name: "/work", description: "Work to earn coins", usage: "/work" },
      { name: "/transfer", description: "Transfer coins to another user", usage: "/transfer @user <amount>" },
      { name: "/shop", description: "Browse the server shop", usage: "/shop" },
      { name: "/buy", description: "Buy an item from the shop", usage: "/buy <item>" },
    ],
  },
  {
    category: "Fun",
    icon: "sparkles",
    commands: [
      { name: "/8ball", description: "Ask the magic 8-ball a question", usage: "/8ball <question>" },
      { name: "/meme", description: "Get a random meme", usage: "/meme" },
      { name: "/roll", description: "Roll a dice", usage: "/roll [sides]" },
      { name: "/flip", description: "Flip a coin", usage: "/flip" },
      { name: "/trivia", description: "Start a trivia question", usage: "/trivia [category]" },
      { name: "/ship", description: "Ship two users together", usage: "/ship @user1 @user2" },
    ],
  },
  {
    category: "Utility",
    icon: "wrench",
    commands: [
      { name: "/help", description: "List all commands", usage: "/help [command]" },
      { name: "/serverinfo", description: "Display server information", usage: "/serverinfo" },
      { name: "/userinfo", description: "Display user information", usage: "/userinfo [@user]" },
      { name: "/avatar", description: "Get a user's avatar", usage: "/avatar [@user]" },
      { name: "/ping", description: "Check the bot's latency", usage: "/ping" },
      { name: "/remind", description: "Set a reminder", usage: "/remind <time> <message>" },
    ],
  },
  {
    category: "Music",
    icon: "music",
    commands: [
      { name: "/play", description: "Play a song from YouTube or Spotify", usage: "/play <query>" },
      { name: "/pause", description: "Pause the current song", usage: "/pause" },
      { name: "/skip", description: "Skip the current song", usage: "/skip" },
      { name: "/queue", description: "View the music queue", usage: "/queue" },
      { name: "/volume", description: "Adjust playback volume", usage: "/volume <1-100>" },
      { name: "/stop", description: "Stop music and clear queue", usage: "/stop" },
    ],
  },
];

router.get("/commands", async (_req, res): Promise<void> => {
  res.json(GetCommandsResponse.parse(commandData));
});

export default router;
