/** ***************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020.
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
import { Util } from "./Util";
import { MultiAnswerQuestion, Question } from "./models/task";

export class TaskUtils {
    /**
     * Fetches the JSON from GitHub and stores it in the browser in localStorage.
     *
     * **Attention:** This function only works for Tasks that have __one__ question and __zero__ answers
     * @param task  Type of the task
     * @param lang  Language of the task
     * @returns Promise that contains all the Questions in the document
     */
    private static storeToLocalFromGit(task: string, lang: string): Promise<Question[]> {
      const url = `https://raw.githubusercontent.com/Herobone/Sober-Sailor/${
          process.env.REACT_APP_BETA_CHANNEL ? "beta" : "main"
      }/tasks/${task}/${lang}.json`;
      return new Promise<string[]>((resolve, reject) => {
            fetch(url)
                .then((response) => response.text())
                .then((json) => {
                    localStorage.setItem(`${task}_${lang}`, json);
                    resolve(JSON.parse(json));
                    return Promise.resolve();
                })
                .catch((error) => {
                    console.error("Error while downloading JSON from GitHub!", error);
                    reject(error);
                });
        });
    }

    /**
     * Gets Tasks either from local storage or as a JSON from GitHub if not stored locally
     *
     * **Attention:** This function only works for Tasks that have __one__ question and __zero__ answers
     * @param task  Type of the task
     * @param lang  Language of the task
     */
    public static getTasks(task: string, lang: string): Promise<string[]> {
        const stored = localStorage.getItem(`${task}_${lang}`);
        if (stored) {
            return JSON.parse(stored);
        }
        return this.storeToLocalFromGit(task, lang);
    }

    /**
     * Fetches the JSON from GitHub and stores it in the browser in localStorage.
     *
     * **Attention:** This function only works for Tasks that have __one__ question and __multiple__ answers
     * @param task  Type of the task
     * @param lang  Language of the task
     * @returns Promise that contains all the Questions in the document
     */
    private static async storeLocalFromGitMultiAnswer(task: string, lang: string): Promise<MultiAnswerQuestion[]> {
      const url = `https://raw.githubusercontent.com/Herobone/Sober-Sailor/${
          process.env.REACT_APP_BETA_CHANNEL ? "beta" : "main"
      }/tasks/${task}/${lang}.json`;
        const response = await fetch(url);
        const data = await response.text();
        localStorage.setItem(`${task}_${lang}`, data);
        return JSON.parse(data);
    }

    /**
     * Gets Tasks either from local storage or as a JSON from GitHub if not stored locally
     *
     * **Attention:** This function only works for Tasks that have __one__ question and __multiple__ answers
     * @param task  Type of the task
     * @param lang  Language of the task
     */
    public static getTasksMultiAnswer(task: string, lang: string): Promise<MultiAnswerQuestion[]> {
        const stored = localStorage.getItem(`${task}_${lang}`);
        if (stored) {
            return JSON.parse(stored);
        }
        return this.storeLocalFromGitMultiAnswer(task, lang);
    }

    public static async getRandomTask(task: string, lang: string): Promise<string> {
        const tasks = await this.getTasks(task, lang);
        return Util.selectRandom(tasks);
    }
}
