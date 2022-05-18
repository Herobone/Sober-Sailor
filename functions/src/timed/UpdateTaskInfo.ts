import * as admin from "firebase-admin";
import Util from "sobersailor-common/lib/Util";
import {
  MultiAnswerTaskExternal,
  SingleAnswerTasksExternal,
  Task,
} from "sobersailor-common/lib/models/Task";
import { tasks } from "sobersailor-common/lib/gamemodes/tasks";
import {
  TaskConfig,
  TaskStats,
} from "sobersailor-common/lib/models/TaskConfig";
import { taskConfigConverter } from "../models/TaskConfig";
import axios, { AxiosResponse } from "axios";
import * as functions from "firebase-functions";
import * as express from "express";

/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2022.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const db = admin.firestore();

interface Stats {
  count: number;
}

const getTaskUrl = (task: string) =>
  `https://raw.githubusercontent.com/Herobone/Sober-Sailor/main/tasks/${task}/en.json`;

const getStatsMulti = async (response: AxiosResponse): Promise<Stats> => {
  const json = (await response.data) as MultiAnswerTaskExternal;
  let count = 0;
  for (const _ in json) {
    count += 1;
  }
  return { count };
};

const getStatsSingle = async (response: AxiosResponse): Promise<Stats> => {
  const json: SingleAnswerTasksExternal =
    (await response.data) as SingleAnswerTasksExternal;
  return { count: Util.indexedObjectToMap(json).size };
};

const getTaskStats = async (task: Task): Promise<Stats> => {
  const url = getTaskUrl(task.id);

  const response = await axios.get(url);

  if (response.status === 200) {
    if (task.multiAnswer) {
      return getStatsMulti(response);
    }
    return getStatsSingle(response);
  } else {
    throw new Error("Error during download");
  }
};

export const updateTaskInfoHandler = async () => {
  const taskConfig: TaskConfig = new Map<string, TaskStats>();
  for (const task of tasks) {
    if (task.id === "tictactoe") {
      taskConfig.set(task.id, { count: 0, ...task });
      continue;
    }
    const stats = await getTaskStats(task);
    console.log(stats);
    taskConfig.set(task.id, { ...stats, ...task });
  }
  await db
    .collection("config")
    .doc("tasks")
    .withConverter(taskConfigConverter)
    .set(taskConfig);

  return taskConfig;
};

export const updateTaskInfoHTTPSHandler = async (
  req: functions.https.Request,
  resp: express.Response
) => {
  resp.json(Util.mapToObj(await updateTaskInfoHandler()));
};
