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
import {
    IMultiAnswerQuestion,
    MultiAnswerTask,
    MultiAnswerTaskExternal,
    Question,
    SingleAnswerTasks,
    SingleAnswerTasksExternal,
} from "sobersailor-common/lib/models/Task";
import Util from "sobersailor-common/lib/Util";

export class TaskUtils {
    private static whereFrom =
        process.env.REACT_APP_BETA_CHANNEL || process.env.NODE_ENV === "development"
            ? process.env.NODE_ENV === "development"
                ? (process.env.REACT_APP_CURRENT_BRANCH as string)
                : "beta"
            : "main";

    /**
     * Fetches the JSON from GitHub and stores it in the browser in localStorage.
     *
     * **Attention:** This function only works for Tasks that have __one__ question and __zero__ answers
     * @param task  Type of the task
     * @param lang  Language of the task
     * @returns Promise that contains all the Questions in the document
     */
    public static async storeToLocalFromGit(task: string, lang = "en"): Promise<SingleAnswerTasks> {
        const url = `https://raw.githubusercontent.com/Herobone/Sober-Sailor/${this.whereFrom}/tasks/${task}/${lang}.json`;

        const response = await fetch(url);

        if (response.status === 200) {
            const json = await response.text();
            localStorage.setItem(`${task}_${lang}`, json);
            const parsed: SingleAnswerTasksExternal = JSON.parse(json);
            return Util.indexedObjectToMap(parsed);
        } else {
            throw new Error("Error during download");
        }
    }

    /**
     * Gets Tasks either from local storage or as a JSON from GitHub if not stored locally
     *
     * **Attention:** This function only works for Tasks that have __one__ question and __zero__ answers
     * @param task  Type of the task
     * @param lang  Language of the task
     */
    public static async getTasks(task: string, lang = "en"): Promise<SingleAnswerTasks> {
        const stored = localStorage.getItem(`${task}_${lang}`);
        if (stored) {
            const parsed: SingleAnswerTasksExternal = JSON.parse(stored);
            return Util.indexedObjectToMap(parsed);
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
    public static async storeLocalFromGitMultiAnswer(task: string, lang = "en"): Promise<MultiAnswerTask> {
        const url = `https://raw.githubusercontent.com/Herobone/Sober-Sailor/${this.whereFrom}/tasks/${task}/${lang}.json`;
        const response = await fetch(url);
        if (response.status === 200) {
            const json = await response.text();
            localStorage.setItem(`${task}_${lang}`, json);
            const parsed: MultiAnswerTaskExternal = JSON.parse(json);
            return Util.indexedObjectToMap(parsed);
        } else {
            throw new Error("Error during download");
        }
    }

    /**
     * Gets Tasks either from local storage or as a JSON from GitHub if not stored locally
     *
     * **Attention:** This function only works for Tasks that have __one__ question and __multiple__ answers
     * @param task  Type of the task
     * @param lang  Language of the task
     */
    public static async getTasksMultiAnswer(task: string, lang = "en"): Promise<MultiAnswerTask> {
        const stored = localStorage.getItem(`${task}_${lang}`);
        if (stored) {
            const parsed: MultiAnswerTaskExternal = JSON.parse(stored);
            return Util.indexedObjectToMap(parsed);
        }
        return this.storeLocalFromGitMultiAnswer(task, lang);
    }

    public static async getRandomTask(
        task: string,
        lang: string,
    ): Promise<{ id: number; question: Question | undefined }> {
        let tasks: SingleAnswerTasks;
        try {
            tasks = await this.getTasks(task, lang);
        } catch {
            tasks = await this.getTasks(task);
        }
        const id = Util.random(0, tasks.size);
        return { id, question: tasks.get(id) };
    }

    public static async getSpecificSingleAnswerTask(
        type: string,
        id: number,
        lang: string,
    ): Promise<Question | undefined> {
        let tasks: SingleAnswerTasks;
        try {
            tasks = await this.getTasks(type, lang);
        } catch {
            tasks = await this.getTasks(type);
        }
        return tasks.get(id);
    }

    public static async getRandomMultiAnswerTask(
        task: string,
        lang: string,
    ): Promise<{ id: number; question: IMultiAnswerQuestion | undefined }> {
        let tasks: MultiAnswerTask;
        try {
            tasks = await this.getTasksMultiAnswer(task, lang);
        } catch {
            tasks = await this.getTasksMultiAnswer(task);
        }
        const id = Util.random(0, tasks.size);
        return { id, question: tasks.get(id) };
    }

    public static async getSpecificMultiAnswerTask(
        type: string,
        id: number,
        lang: string,
    ): Promise<IMultiAnswerQuestion | undefined> {
        let tasks: MultiAnswerTask;
        try {
            tasks = await this.getTasksMultiAnswer(type, lang);
        } catch {
            tasks = await this.getTasksMultiAnswer(type);
        }
        return tasks.get(id);
    }
}
