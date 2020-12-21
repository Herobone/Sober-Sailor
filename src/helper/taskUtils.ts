import Util from "./Util";

/*****************************
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

export function storeToLocalFromGit(task: string, lang: string, onFinish: (tasks: string[]) => void) {
    const url = "https://raw.githubusercontent.com/Herobone/Sober-Sailor/main/src/gamemodes/mixed/tasks/" + task + "/" + lang + ".json";
    fetch(url)
        .then(response => response.text())
        .then(json => {
            localStorage.setItem(task + "_" + lang, json);
            onFinish(JSON.parse(json));
        })
        .catch(error => console.error("Error while downloading JSON from GitHub!", error));
}

export function getTasks(task: string, lang: string, onFinish: (tasks: string[]) => void) {
    let stored = localStorage.getItem(task + "_" + lang);
    if (stored) {
        onFinish(JSON.parse(stored));
        console.log("From local");
    } else {
        storeToLocalFromGit(task, lang, onFinish);
        console.log("Form server");
    }
}

export function getRandomTask(task: string, lang: string, onFinish: (task: string) => void) {
    getTasks(task, lang, (tasks) => {
        onFinish(Util.selectRandom(tasks));
    });
}