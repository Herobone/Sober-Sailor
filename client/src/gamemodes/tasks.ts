import { Task } from "sobersailor-common/lib/models/Task";

export const tasks: Task[] = [
    {
        id: "whowouldrather",
        singleTarget: false,
        multiAnswer: false,
    },
    {
        id: "truthordare",
        singleTarget: true,
        multiAnswer: false,
    },
    {
        id: "tictactoe",
        singleTarget: true,
        multiAnswer: false,
    },
    {
        id: "wouldyourather",
        singleTarget: false,
        multiAnswer: true,
    },
];
