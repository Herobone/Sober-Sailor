/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

import * as functions from "firebase-functions";
import { GameIDContent } from "sobersailor-common/lib/HostEvents";
import VerifiedHostExecutor from "../helper/VerifiedHostExecutor";
import { tasks, TaskType } from "sobersailor-common/lib/gamemodes/tasks";
import { PlayerList } from "sobersailor-common/lib/models/PlayerList";
import Util from "sobersailor-common/lib/Util";
import { Task } from "sobersailor-common/lib/models/Task";
import { Player } from "sobersailor-common/lib/models/Player";
import FirestoreUtil from "../helper/FirestoreUtil";
import { Game } from "sobersailor-common/lib/models/Game";
import { TaskConfig } from "sobersailor-common/lib/models/TaskConfig";
import { TicUtils } from "../helper/TicUtils";

const MAX_REPEATS = 20;

const setTask = async (
  gameData: Game,
  type: Task,
  newTarget: PlayerList,
  taskConfig: TaskConfig,
  newPenalty = 0
): Promise<void> => {
  const localTarget = newTarget ? newTarget[0] : null;

  const task = Util.random(0, taskConfig.get(type.id)!.count - 1);
  const id = type.id + task + newTarget;

  /// Check if this task has been here before in the near past
  if (gameData.latestTasks.includes(id)) {
    throw new Error(); // This throws so that a new target and task can be selected
  }

  if (gameData.latestTasks.length >= MAX_REPEATS) {
    // Delete the first elements that are longer ago than 20 items
    gameData.latestTasks.splice(
      0,
      gameData.latestTasks.length - (MAX_REPEATS - 1)
    );
  }
  gameData.latestTasks.push(id);

  await updateGame(gameData, task, type.id, localTarget, newPenalty);
};

const setMultiAnswerTask = async (
  gameData: Game,
  type: Task,
  taskConfig: TaskConfig
): Promise<void> => {
  const task = Util.random(0, taskConfig.get(type.id)!.count - 1);
  const id = type.id + task;
  if (gameData.latestTasks.includes(id)) {
    return setMultiAnswerTask(gameData, type, taskConfig);
  }
  if (gameData.latestTasks.length >= 20) {
    // Delete the first elements that are longer ago than 20 items
    gameData.latestTasks.splice(0, gameData.latestTasks.length - 19);
  }
  gameData.latestTasks.push(id);

  await updateGame(gameData, task, type.id, null, 0);
};

const setTicTacToe = async (gameData: Game, players: Player[]) => {
  /// Check if this task has been here before in the near past
  const len = gameData.latestTasks.length;
  const rep = MAX_REPEATS * 0.5;
  if (len < rep) {
    if (gameData.latestTasks.includes(TaskType.TIC_TAC_TOE)) {
      throw new Error(); // This throws so that a new target and task can be selected
    }
  } else {
    const split = gameData.latestTasks.slice(len - rep, len - 1);
    if (split.includes(TaskType.TIC_TAC_TOE)) {
      throw new Error(); // This throws so that a new target and task can be selected
    }
  }

  const newPenalty = Util.random(3, 7);

  const targets = getRandomPlayer(players, 2);

  if (targets && targets.length === 2) {
    await TicUtils.registerTicTacToe(targets, gameData);
    if (gameData.latestTasks.length >= MAX_REPEATS) {
      // Delete the first elements that are longer ago than 20 items
      gameData.latestTasks.splice(
        0,
        gameData.latestTasks.length - (MAX_REPEATS - 1)
      );
    }
    gameData.latestTasks.push(TaskType.TIC_TAC_TOE);
    await updateGame(gameData, null, TaskType.TIC_TAC_TOE, null, newPenalty);
    return;
  }
  throw new Error();
};

const updateGame = (
  game: Game,
  currentTask: number | null,
  type: string,
  taskTarget: string | null,
  penalty: number
) =>
  FirestoreUtil.getGame(game.gameID).update({
    currentTask,
    type,
    evalState: false,
    pollState: false,
    taskTarget,
    penalty,
    latestTasks: game.latestTasks,
  });

const getRandomPlayer = (players: Player[], n = 1): PlayerList => {
  let localPlayers = [...players]; // Create a copy of the player array, so we don't modify the original
  if (n < 1) {
    throw new RangeError(
      "Can not get fewer than 1 players. That would be kinda stupid"
    );
  }
  if (n > players.length) {
    throw new Error(
      `Trying to get ${n} players while Game only has ${players.length} players`
    );
  }

  // Create an array for all the chosen players. Length is predefined. Contains UIDs
  const chosen: string[] = Array.from({ length: n });
  for (let i = 0; i < n; i++) {
    const choose = Util.getRandomElement(localPlayers); // Choose a random player

    // Add the players UID to the chosen players array
    chosen[i] = choose.uid;

    // Remove the player from the local copy, so they don't get chosen twice
    localPlayers = Util.arrayRemove(localPlayers, choose);
  }
  return chosen;
};

const singleTask = async (
  gameData: Game,
  nextTaskType: Task,
  players: Player[],
  taskConfig: TaskConfig
) => {
  const nextTarget = getRandomPlayer(players, nextTaskType.targetCount);
  try {
    await setTask(
      gameData,
      nextTaskType,
      nextTarget,
      taskConfig,
      Util.random(3, 7)
    );
  } catch (e) {
    return singleTask(gameData, nextTaskType, players, taskConfig);
  }
};

export const nextTaskHandler = async (
  data: GameIDContent,
  context: functions.https.CallableContext
) => {
  const { players, gameData } = await VerifiedHostExecutor.promiseHost(
    data.gameID,
    context
  );
  const taskConfig = await FirestoreUtil.getTaskConfig();
  if (!taskConfig) {
    throw new RangeError(
      "There were no tasks loaded. Something in Task Config must be wrong"
    );
  }

  let nextTaskType = Util.selectRandom(tasks);

  if (nextTaskType.id === TaskType.TIC_TAC_TOE) {
    try {
      await setTicTacToe(gameData, players);
      return;
    } catch {
      while (nextTaskType.id === TaskType.TIC_TAC_TOE) {
        nextTaskType = Util.selectRandom(tasks);
      }
    }
  }

  if (nextTaskType.multiAnswer) {
    await setMultiAnswerTask(gameData, nextTaskType, taskConfig);
    return;
  }

  if (nextTaskType.targetCount > 0) {
    await singleTask(gameData, nextTaskType, players, taskConfig);
  } else {
    await setTask(gameData, nextTaskType, null, taskConfig);
  }
};
