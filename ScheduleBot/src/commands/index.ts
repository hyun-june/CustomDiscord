import type { SlashCommand } from "../types/command.js";
import { helpCommand } from "./help.js";
import { pingCommand } from "./ping.js";
import { pollCommand } from "./poll.js";
import { scheduleCommand } from "./schedule.js";

export const commands: SlashCommand[] = [pingCommand, helpCommand, pollCommand, scheduleCommand];
export const commandMap = new Map(commands.map((command) => [command.data.name, command]));
