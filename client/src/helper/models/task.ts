/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020-2022.
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
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { IMultiAnswerQuestionExternal, MultiAnswerQuestion } from "sobersailor-common/lib/models/Task";

export const multiAnswerQuestionConverter = {
    toFirestore(question: MultiAnswerQuestion): DocumentData {
        return {
            question: question.question,
            answers: question.answers,
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<IMultiAnswerQuestionExternal>,
        options: SnapshotOptions,
    ): MultiAnswerQuestion {
        const data = snapshot.data(options);
        return new MultiAnswerQuestion(data.question, data.answers);
    },
};
