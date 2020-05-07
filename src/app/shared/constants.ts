export abstract class Constants {
    static readonly RESULT_GAME_VICTORY: string = 'victory';
    static readonly RESULT_GAME_DRAW: string = 'draw';
    static readonly RESULT_GAME_DEFEAT: string = 'defeat';
    static readonly TIME_QUESTION: number = 15;
    static readonly QUESTIONS: number = 4;

    static readonly POINTS_QUESTION_CORRECT_C2: number = 20;
    static readonly POINTS_QUESTION_CORRECT_C1: number = 15;
    static readonly POINTS_QUESTION_CORRECT_B2: number = 10;
    static readonly POINTS_QUESTION_CORRECT_B1: number = 5;

    static readonly POINTS_MATCH_VICTORY_C2: number = 200;
    static readonly POINTS_MATCH_DRAW_C2: number = 100;
    static readonly POINTS_MATCH_VICTORY_C1: number = 150;
    static readonly POINTS_MATCH_DRAW_C1: number = 75;
    static readonly POINTS_MATCH_VICTORY_B2: number = 100;
    static readonly POINTS_MATCH_DRAW_B2: number = 50;
    static readonly POINTS_MATCH_VICTORY_B1: number = 50;
    static readonly POINTS_MATCH_DRAW_B1: number = 25;

    static readonly LEVEL_BASE: number = 200;

    static readonly LEVEL_B1: string = 'b1';
    static readonly LEVEL_B2: string = 'b2';
    static readonly LEVEL_C1: string = 'c1';
    static readonly LEVEL_C2: string = 'c2';

    static readonly GAME_MODE_PRACTISE: string = 'practise';
    static readonly GAME_MODE_MATCH: string = 'match';

    static readonly GAME_DEFINITIONS: string = 'definitions';
    static readonly GAME_SYNONYMS: string = 'synonyms';
    static readonly GAME_ANTONYMS: string = 'antonyms';
}
