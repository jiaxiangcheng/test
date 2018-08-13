import { Classification } from './classification';

export interface Game {
    name: string;
    classification: Classification;
    startDate: string;
    endDate: string;
}
